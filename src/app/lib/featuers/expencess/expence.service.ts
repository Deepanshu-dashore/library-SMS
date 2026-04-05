import { connectDB } from "../../db/connectDB";
import { getUrls } from "../../utils/geturl";
import { Expense } from "./expence.model";

export class ExpenceService {
  static async createExpence(data: any) {
    await connectDB();
    return await Expense.create(data);
  }

  static async getAllExpence() {
    await connectDB();
    const data = (await Expense.find().sort({ createdAt: -1 }).lean()).map(
      (item: any) => {
        return {
          ...item,
          receipt: item.receipt ? getUrls.getUrl(item.receipt, "row") : "",
        };
      },
    );
    const totalExpence = await Expense.aggregate([
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
    const data = (await Expense.findById(id).lean()) as any;
    return {
      ...data,
      receipt: data.receipt ? getUrls.getUrl(data.receipt, "row") : "",
    };
  }

  static async updateExpence(id: string, data: any) {
    await connectDB();
    return await Expense.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteExpence(id: string) {
    await connectDB();
    return await Expense.findByIdAndDelete(id);
  }
}
