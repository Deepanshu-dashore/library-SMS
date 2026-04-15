import { connectDB } from "../../db/connectDB";
import { getUrls } from "../../utils/geturl";
import { Expense } from "./expence.model";

export class ExpenceService {
  static async createExpence(data: any) {
    await connectDB();
    return await Expense.create(data);
  }

  static async getAllExpence(search?: string) {
    await connectDB();
    let query: any = {};
    if (search) {
      const isNumber = !isNaN(Number(search));
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
      if (isNumber) {
        query.$or.push({ amount: Number(search) });
      }
    }
    const data = await Expense.find(query).sort({ createdAt: -1 }).lean();
    const totalExpence = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const total = totalExpence[0]?.total || 0;
    return { data, total };
  }

  static async getExpenceById(id: string) {
    await connectDB();
    return await Expense.findById(id).lean();
  }

  static async updateExpence(id: string, data: any) {
    await connectDB();
    return await Expense.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    }).lean();
  }

  static async deleteExpence(id: string) {
    await connectDB();
    return await Expense.findByIdAndDelete(id);
  }
}
