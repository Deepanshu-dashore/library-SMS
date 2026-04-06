import { connectDB } from "../../db/connectDB";
import { Seat } from "./seats.model";

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
    return await Seat.find();
  }
  static async getSeatByUserIdService(userId: string) {
    await connectDB();
    return await Seat.findOne({ userId });
  }
  static async getSeatByIdService(id: string) {
    await connectDB();
    return await Seat.findById(id);
  }
  static async updateSeatService(id: string, body: any) {
    await connectDB();
    return await Seat.findByIdAndUpdate(id, body, { new: true });
  }
  static async deleteSeatService(id: string) {
    await connectDB();
    return await Seat.findByIdAndDelete(id);
  }
}
