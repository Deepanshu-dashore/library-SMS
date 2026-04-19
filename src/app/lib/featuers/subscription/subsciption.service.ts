import mongoose from "mongoose";
import { Payment } from "../payment/payment.model";
import { Seat } from "../seat/seats.model";
import { Subscription } from "./subscription.model";
import { generateReceiptNumber } from "@/app/lib/utils/generateReceipt";
import { connectDB } from "../../db/connectDB";

export class SubscriptionService {
  static async createSubscription(
    userId: string,
    seatId: string,
    durationDays: number,
    startDate: Date,
    paymentMode: string,
  ) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);
      const seat = await Seat.findById(seatId).session(session);
      if (!seat) {
        throw new Error("Seat not found");
      }
      const amount = Math.round((seat.price / 30) * durationDays);

      // Check if user already has an active subscription
      const userConflict = await Subscription.findOne({
        userId,
        status: "active",
        endDate: { $gte: new Date() },
      }).session(session);

      if (userConflict) {
        throw new Error(
          `Member already has an active subscription until ${userConflict.endDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
        );
      }

      const conflict = await Subscription.findOne({
        seatId,
        status: "active",
        endDate: { $gte: new Date() },
      }).session(session);
      if (conflict) {
        throw new Error("Seat is already booked");
      }
      const validModes = ["cash", "upi", "card"];
      if (!validModes.includes(paymentMode)) {
        throw Error("Invalid payment mode");
      }
      const [subscription] = await Subscription.create(
        [
          {
            userId,
            seatId,
            startDate,
            endDate,
            status: "active",
          },
        ],
        { session },
      );
      const [payment] = await Payment.create(
        [
          {
            userId,
            subscriptionId: subscription._id,
            amount,
            paymentMode,
            durationDays,
            receiptNumber: generateReceiptNumber(),
          },
        ],
        { session },
      );
      seat.status = "occupied";
      await seat.save({ session });
      await session.commitTransaction();
      return { subscription, payment };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async transferSubscription(
    subscriptionId: string,
    fromSeatId: string,
    toSeatId: string,
  ) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const subscription =
        await Subscription.findById(subscriptionId).session(session);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const seat = await Seat.findById(toSeatId).session(session);
      const fromSeat = await Seat.findById(fromSeatId).session(session);
      if (!seat) {
        throw new Error("New Seat not found");
      }
      if (!fromSeat) {
        throw new Error("From Seat not found");
      }
      if (subscription.status !== "active") {
        throw new Error("Subscription is not active");
      }
      if (subscription.seatId.equals(toSeatId)) {
        throw new Error("Already on this seat");
      }
      const conflict = await Subscription.findOne({
        seatId: toSeatId,
        status: "active",
        endDate: { $gte: new Date() },
      }).session(session);

      if (conflict) throw Error("New seat occupied");

      // Perform transfer
      subscription.transferHistory.push({
        fromSeat: fromSeat._id,
        toSeat: seat._id,
        date: new Date(),
      });

      subscription.seatId = seat._id;
      await subscription.save({ session });

      seat.status = "occupied";
      fromSeat.status = "available";
      await seat.save({ session });
      await fromSeat.save({ session });
      await session.commitTransaction();
      return subscription;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async cancelSubscription(subscriptionId: string) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const subscription =
        await Subscription.findById(subscriptionId).session(session);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      if (subscription.status !== "active") {
        throw new Error("Subscription is not active");
      }
      subscription.status = "cancelled";
      subscription.cancelledAt = new Date();
      await subscription.save({ session });
      const seat = await Seat.findById(subscription.seatId).session(session);
      if (!seat) {
        throw new Error("Seat not found");
      }
      seat.status = "available";
      await seat.save({ session });
      await session.commitTransaction();
      return subscription;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async renewSubscription(
    subscriptionId: string,
    durationDays: number,
    paymentMode: string,
  ) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const subscription =
        await Subscription.findById(subscriptionId).session(session);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      if (subscription.status === "cancelled") {
        throw new Error("Subscription is cancelled");
      }
      const seat = await Seat.findById(subscription.seatId).session(session);
      if (!seat) {
        throw new Error("Seat not found");
      }
      const today = new Date();
      if (subscription.endDate < today) {
        const conflict = await Subscription.findOne({
          seatId: subscription.seatId,
          status: "active",
          endDate: { $gte: today },
          _id: { $ne: subscription._id },
        }).session(session);

        if (conflict) {
          throw Error("Seat already reassigned");
        }
      }
      if (durationDays <= 0) throw Error("Invalid duration");

      let baseDate;

      if (subscription.endDate >= today) {
        // still active, extend from current end date
        baseDate = new Date(subscription.endDate);
      } else {
        // expired, start from today
        baseDate = today;
        subscription.startDate = today;
      }

      const validModes = ["cash", "upi", "card"];
      if (!validModes.includes(paymentMode)) {
        throw Error("Invalid payment mode");
      }

      const newEndDate = new Date(baseDate);
      newEndDate.setDate(newEndDate.getDate() + durationDays);

      subscription.endDate = newEndDate;
      subscription.status = "active";

      await subscription.save({ session });

      // Ensure seat is occupied
      seat.status = "occupied";
      await seat.save({ session });

      if (!seat.price) throw Error("Seat price not defined");

      const dayPrice = seat.price / 30; // acceptable assumption for now
      const amount = Math.round(dayPrice * durationDays);

      const [payment] = await Payment.create(
        [
          {
            userId: subscription.userId,
            subscriptionId: subscription._id,
            amount,
            paymentMode,
            durationDays,
            receiptNumber: generateReceiptNumber(),
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return { subscription, payment };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getSubscription(subscriptionId: string) {
    await connectDB();
    const subscription = await Subscription.findById(subscriptionId)
      .populate("userId")
      .populate("seatId")
      .select("-__v");
    const payment = await Payment.find({ subscriptionId })
      .select("-__v")
      .lean();
    return { subscription, payment };
  }

  static async seatCalender(month: number, year: number) {
    await connectDB();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const seatCalender = await Subscription.find({
      status: { $in: ["active", "expired"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    })
      .populate("seatId", "seatNumber")
      .populate("userId", "name")
      .lean();
    const events = seatCalender.map((sub) => ({
      title: `Seat ${sub.seatId.seatNumber}`,
      start: sub.startDate,
      end: sub.endDate,
      user: sub.userId.name,
      status: sub.status,
    }));
    return events;
  }

  static async getAllSubscription(filterQuery?: any) {
    await connectDB();
    const today = new Date();

    // Base stats calculation
    const totalActive = await Subscription.countDocuments({
      status: "active",
      endDate: { $gte: today },
    });
    const totalExpired = await Subscription.countDocuments({
      status: "active",
      endDate: { $lt: today },
    });
    const totalCancelled = await Subscription.countDocuments({
      status: "cancelled",
    });
    const totalSub = await Subscription.countDocuments();

    // Prepare filter for find
    let mongoFilter = {};
    if (filterQuery?.status) {
      if (filterQuery.status === "active") {
        mongoFilter = { status: "active", endDate: { $gte: today } };
      } else if (filterQuery.status === "expired") {
        mongoFilter = { status: "active", endDate: { $lt: today } };
      } else if (filterQuery.status === "cancelled") {
        mongoFilter = { status: "cancelled" };
      }
    }

    const subscriptions = await Subscription.find(mongoFilter)
      .populate("userId", "name email")
      .populate("seatId", "seatNumber")
      .select("-__v -transferHistory")
      .sort({ createdAt: -1 });

    return {
      subscriptions,
      totalActive,
      totalExpired,
      totalCancelled,
      totalSub,
    };
  }

  static async deleteSubscription(subscriptionId: string) {
    await connectDB();
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    if (subscription.status !== "cancelled") {
      throw new Error("Subscription is not cancelled");
    }
    const seat = await Seat.findById(subscription.seatId);
    if (!seat) {
      throw new Error("Seat not found");
    }
    seat.status = "available";
    await seat.save();
    const deleted = await Subscription.findByIdAndDelete(subscriptionId);
    return deleted;
  }
}
