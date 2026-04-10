import { connectDB } from "../../db/connectDB";
import { Library } from "./library.model";

export class LibraryService {
  static async createLibrary(body: any) {
    await connectDB();
    return await Library.create(body);
  }
  static async getLibraryByEmail(email: string) {
    await connectDB();
    return await Library.findOne({ email });
  }
  static async updateLibrary(body: any, id: string) {
    await connectDB();
    return await Library.findByIdAndUpdate(id, body, { returnDocument: 'after' });
  }
  static async addFloor(floor: string, id: string) {
    await connectDB();
    return await Library.findByIdAndUpdate(
      id,
      { $push: { floors: floor } },
      { returnDocument: 'after' },
    );
  }
  static async getLibraryFloors(id: string) {
    await connectDB();
    return await Library.findById(id).select("floors").lean();
  }
  static async deleteFloor(floor: string, id: string) {
    await connectDB();
    return await Library.findByIdAndUpdate(
      id,
      { $pull: { floors: floor } },
      { returnDocument: 'after' },
    );
  }
  static async deleteLibrary(id: string) {
    await connectDB();
    return await Library.findByIdAndDelete(id);
  }
  static async getLibrary(id: string) {
    await connectDB();
    return await Library.findById(id);
  }
  static async getAllLibraries() {
    await connectDB();
    return await Library.find().lean();
  }
}
