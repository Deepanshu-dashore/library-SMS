import { Payment } from "./payment.model";

export class PaymentService {
  static async getAllPayment() {
    try {
      const payments = await Payment.find()
        .populate("userId", "name email")
        .select("-__v");
      return payments;
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
