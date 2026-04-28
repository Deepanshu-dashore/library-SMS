import mongoose from "mongoose";
import { connectDB } from "../../db/connectDB";
import { User } from "./user.model";

import { Subscription } from "../subscription/subscription.model";
import { Seat } from "../seat/seats.model";
import { Payment } from "../payment/payment.model";

export class UserService {
  static async createUserService(data: any) {
    await connectDB();
    const user = await User.create(data);
    return user;
  }

  static async softDeleteUserService(id: string) {
    await connectDB();
    const user = await User.findByIdAndUpdate(id, { isDeleted: true });
    return user;
  }

  static async restoreUserService(id: string) {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { returnDocument: "after" },
    );
    return user;
  }

  static async getTrashUserService(page: number, limit: number) {
    await connectDB();
    const filter = { isDeleted: true };
    const users = await User.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments(filter);
    return { users, total };
  }

  static async getAllUserService(page: number, limit: number, filter: any) {
    await connectDB();
    const finalFilter = { ...filter, isDeleted: { $ne: true } };

    // Perform queries in parallel for better performance
    // Individual countDocuments on indexed fields is often faster than aggregation for simple totals
    const [
      users,
      total,
      activeCount,
      inactiveCount,
      unverifyCount,
      withoutSeatCount,
    ] = await Promise.all([
      User.find(finalFilter)
        .select("name email number category status course photo createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(finalFilter),
      User.countDocuments({ status: "Active", isDeleted: { $ne: true } }),
      User.countDocuments({ status: "Inactive", isDeleted: { $ne: true } }),
      User.countDocuments({ status: "Unverify", isDeleted: { $ne: true } }),
      User.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        {
          $lookup: {
            from: "subscriptions",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$userId"] },
                  status: "active",
                  endDate: { $gte: new Date() },
                },
              },
            ],
            as: "activeSubscriptions",
          },
        },
        { $match: { activeSubscriptions: { $size: 0 } } },
        { $count: "count" },
      ]).then((res) => res[0]?.count || 0),
    ]);

    let finalUsers = users;
    let finalTotal = total;

    // If "WithoutSeat" filter is active, we use aggregation for the list too
    if (filter.status === "WithoutSeat") {
      const aggResult = await User.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        {
          $lookup: {
            from: "subscriptions",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$userId"] },
                  status: "active",
                  endDate: { $gte: new Date() },
                },
              },
            ],
            as: "activeSubscriptions",
          },
        },
        { $match: { activeSubscriptions: { $size: 0 } } },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            name: 1,
            email: 1,
            number: 1,
            category: 1,
            status: 1,
            course: 1,
            photo: 1,
            createdAt: 1,
          },
        },
      ]);
      finalUsers = aggResult;
      finalTotal = withoutSeatCount;
    }

    return {
      users: finalUsers,
      total: finalTotal,
      stats: {
        total: activeCount + inactiveCount + unverifyCount,
        active: activeCount,
        inactive: inactiveCount,
        unverify: unverifyCount,
        withoutSeat: withoutSeatCount,
      },
    };
  }

  static async getUserByIdService(id: string) {
    await connectDB();
    const subscription = await Subscription.findOne({ userId: id })
      .populate("seatId", "seatNumber floor type")
      .lean();
    const payment = await Payment.findOne({ userId: id }).lean();
    const user = await User.findById(id).select("-password -__v").lean();
    return { user, subscription, payment };
  }

  static async updateUserService(id: string, data: any) {
    await connectDB();
    const user = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    return user;
  }

  static async deleteUserService(id: string) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Find active subscriptions for the user to free up their currently occupied seats
      const activeSubscriptions = await Subscription.find({
        userId: id,
        status: "active",
        endDate: { $gte: new Date() },
      }).session(session);

      // Get all seat IDs associated with active subscriptions
      const seatIds = activeSubscriptions
        .map((sub: any) => sub.seatId)
        .filter(Boolean);

      if (seatIds.length > 0) {
        // Mark only the active seats as available
        await Seat.updateMany(
          { _id: { $in: seatIds } },
          { $set: { status: "available" } },
          { session },
        );
      }

      // Delete all related records
      await Subscription.deleteMany({ userId: id }, { session });
      await Payment.deleteMany({ userId: id }, { session });

      // Finally delete the user
      const user = await User.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
