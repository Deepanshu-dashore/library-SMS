import { Payment } from "./payment.model";

export class PaymentService {
  static async getAllPayment(search?: string, mode?: string) {
    try {
      let query: any = {};

      if (mode && mode !== "All") {
        query.paymentMode = mode.toLowerCase();
      }

      const allPayments = await Payment.find();
      const stats = {
        total: allPayments.reduce((acc, curr) => acc + curr.amount, 0),
        count: allPayments.length,
        cash: {
          amount: allPayments.filter(p => p.paymentMode === "cash").reduce((acc, curr) => acc + curr.amount, 0),
          count: allPayments.filter(p => p.paymentMode === "cash").length
        },
        upi: {
          amount: allPayments.filter(p => p.paymentMode === "upi").reduce((acc, curr) => acc + curr.amount, 0),
          count: allPayments.filter(p => p.paymentMode === "upi").length
        },
        card: {
          amount: allPayments.filter(p => p.paymentMode === "card").reduce((acc, curr) => acc + curr.amount, 0),
          count: allPayments.filter(p => p.paymentMode === "card").length
        },
        lastEntry: allPayments.length > 0 ? allPayments.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt : null
      };

      const payments = await Payment.find(query)
        .populate({
          path: "userId",
          match: search ? { name: { $regex: search, $options: "i" } } : {},
          select: "name email"
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return { 
        payments: search ? payments.filter(p => p.userId) : payments,
        stats 
      };
    } catch (error) {
      throw error;
    }
  }
  static async getPaymentById(id: string) {
    try {
      const payment = await Payment.findById(id)
        .populate("userId")
        .populate("subscriptionId")
        .select("-__v");
      return payment;
    } catch (error) {
      throw error;
    }
  }
}
