import { connectDB } from "../../db/connectDB";
import { User } from "./user.model";

export class UserService {
  static async createUserService(data: any) {
    await connectDB();
    const user = await User.create(data);
    return user;
  }

  static async getAllUserService(page: number, limit: number, filter: any) {
    await connectDB();
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments(filter);
    return { users, total };
  }

  static async getUserByIdService(id: string) {
    await connectDB();
    const user = await User.findById(id);
    return user;
  }

  static async updateUserService(id: string, data: any) {
    await connectDB();
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return user;
  }

  static async deleteUserService(id: string) {
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}
