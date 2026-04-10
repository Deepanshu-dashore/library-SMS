import { connectDB } from "../../db/connectDB";
import { Seat } from "./seats.model";

import { Subscription } from "../subscription/subscription.model";
import { User } from "../user/user.model";

export class SeatService {
  static async createSeatService(data: any) {
    await connectDB();
    return await Seat.create(data);
  }
  static async createMultipleSeatService(data: any[]) {
    await connectDB();
    return await Seat.insertMany(data);
  }
  static async getAllSeatService() {
    await connectDB();
    return await Seat.find({ isDeleted: { $ne: true } }).select("-__v");
  }

  static async getTrashSeatService() {
    await connectDB();
    return await Seat.find({ isDeleted: true })
      .select("-__v")
      .sort({ updatedAt: -1 });
  }

  static async softDeleteSeatService(id: string) {
    await connectDB();
    const seat = await Seat.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" },
    );
    return seat;
  }

  static async restoreSeatService(id: string) {
    await connectDB();
    const seat = await Seat.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { returnDocument: "after" },
    );
    return seat;
  }

  static async getSeatByUserIdService(userId: string) {
    await connectDB();
    return await Seat.findOne({ userId, isDeleted: { $ne: true } }).select(
      "-__v",
    );
  }
  static async getSeatByIdService(id: string) {
    await connectDB();
    return await Seat.findById(id);
  }
  static async updateSeatService(id: string, body: any) {
    await connectDB();
    return await Seat.findByIdAndUpdate(id, body, { returnDocument: "after" });
  }
  static async deleteSeatService(id: string) {
    await connectDB();
    // Check for active subscriptions
    const activeSubscription = await Subscription.findOne({
      seatId: id,
      status: "active",
      endDate: { $gte: new Date() },
    }).populate("userId");

    if (activeSubscription) {
      const user = activeSubscription.userId as any;
      throw new Error(
        `Cannot delete seat. Member ${user?.name || "Unknown"} has an active subscription on this seat.`,
      );
    }
    return await Seat.findByIdAndDelete(id);
  }
}
