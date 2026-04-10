import { connectDB } from "../../db/connectDB";
import { User } from "./user.model";

import { Subscription } from "../subscription/subscription.model";
import { Seat } from "../seat/seats.model";

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
    const users = await User.find(finalFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments(finalFilter);
    return { users, total };
  }

  static async getUserByIdService(id: string) {
    await connectDB();
    const user = await User.findById(id);
    return user;
  }

  static async updateUserService(id: string, data: any) {
    await connectDB();
    const user = await User.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    return user;
  }

  static async deleteUserService(id: string) {
    await connectDB();
    // Check for active subscriptions
    const activeSubscription = await Subscription.findOne({
      userId: id,
      status: "active",
      endDate: { $gte: new Date() },
    }).populate("seatId");

    if (activeSubscription) {
      const seat = activeSubscription.seatId as any;
      throw new Error(
        `Cannot delete member. They have an active subscription for seat ${seat?.seatNumber || "N/A"}.`,
      );
    }
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}
