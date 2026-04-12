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
  static async getAllSeatService(
    filters: {
      floor?: string;
      status?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    await connectDB();
    const query: Record<string, any> = { isDeleted: { $ne: true } };
    if (filters.floor) query.floor = filters.floor;
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;

    let seatsQuery = Seat.find(query)
      .select("-__v")
      .collation({ locale: "en", numericOrdering: true })
      .sort({ seatNumber: 1 });

    if (filters.page && filters.limit) {
      const skip = (filters.page - 1) * filters.limit;
      seatsQuery = seatsQuery.skip(skip).limit(filters.limit);
    }

    const [
      seats,
      totalCount,
      totalSeats,
      available,
      occupied,
      maintenance,
      acSeats,
      floors,
    ] = await Promise.all([
      seatsQuery,
      Seat.countDocuments(query),
      Seat.countDocuments({ isDeleted: { $ne: true } }),
      Seat.countDocuments({
        isDeleted: { $ne: true },
        status: { $in: ["available", null, ""] },
      }),
      Seat.countDocuments({ isDeleted: { $ne: true }, status: "occupied" }),
      Seat.countDocuments({ isDeleted: { $ne: true }, status: "maintenance" }),
      Seat.countDocuments({ isDeleted: { $ne: true }, type: "ac" }),
      Seat.distinct("floor", { isDeleted: { $ne: true } }),
    ]);

    return {
      seats,
      totalCount,
      stats: { totalSeats, available, occupied, maintenance, acSeats },
      floors: floors.filter(Boolean).sort(),
    };
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

  static async maintance(seatId: string) {
    await connectDB();
    const seat = await Seat.findById(seatId);
    if (!seat) throw new Error("Seat not found");

    if (seat.status === "maintenance") {
      throw new Error("Seat is already in maintenance mode");
    }
    if (seat.status === "occupied") {
      // Find who's occupying it for a helpful message
      const activeSub = await Subscription.findOne({
        seatId,
        status: "active",
        endDate: { $gte: new Date() },
      }).populate("userId");
      const user = activeSub?.userId as any;
      throw new Error(
        `Cannot mark as maintenance. Member ${user?.name || "Unknown"} has an active subscription until ${new Date(activeSub!.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.`,
      );
    }

    return await Seat.findByIdAndUpdate(
      seatId,
      { status: "maintenance" },
      { new: true },
    );
  }
  static async completeMaintance(seatId: string) {
    await connectDB();
    const seat = await Seat.findById(seatId);
    if (!seat) {
      throw new Error("Seat not found");
    }
    if (seat.status !== "maintenance") {
      throw new Error("Seat is not in maintenance");
    }
    if (seat.status === "occupied") {
      throw new Error("Seat is occupied can't complete maintenance");
    }
    return await Seat.findByIdAndUpdate(
      seatId,
      { status: "available" },
      { returnDocument: "after" },
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
