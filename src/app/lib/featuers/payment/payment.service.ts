import { mail } from "../../services/mail.service";
import { Payment } from "./payment.model";
import { MailTemplates } from "../../templates/mailTemplates";
import { JWTHelper } from "../../utils/JWTHelper";

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
          amount: allPayments
            .filter((p) => p.paymentMode === "cash")
            .reduce((acc, curr) => acc + curr.amount, 0),
          count: allPayments.filter((p) => p.paymentMode === "cash").length,
        },
        upi: {
          amount: allPayments
            .filter((p) => p.paymentMode === "upi")
            .reduce((acc, curr) => acc + curr.amount, 0),
          count: allPayments.filter((p) => p.paymentMode === "upi").length,
        },
        card: {
          amount: allPayments
            .filter((p) => p.paymentMode === "card")
            .reduce((acc, curr) => acc + curr.amount, 0),
          count: allPayments.filter((p) => p.paymentMode === "card").length,
        },
        lastEntry:
          allPayments.length > 0
            ? allPayments.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
              )[0].createdAt
            : null,
      };

      const payments = await Payment.find(query)
        .populate({
          path: "userId",
          match: search ? { name: { $regex: search, $options: "i" } } : {},
          select: "name email",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      return {
        payments: search ? payments.filter((p) => p.userId) : payments,
        stats,
      };
    } catch (error) {
      throw error;
    }
  }
  static async getPaymentById(id: string) {
    try {
      const payment = await Payment.findById(id)
        .populate("userId")
        .populate({
          path: "subscriptionId",
          populate: {
            path: "seatId",
            model: "Seat",
          },
        })
        .select("-__v");
      return payment;
    } catch (error) {
      throw error;
    }
  }

  static async sendReceiptEmail(id: string, library: any) {
    try {
      const payment: any = await this.getPaymentById(id);
      if (!payment) throw new Error("Payment not found");

      const userEmail = payment.userId.email;
      if (!userEmail) throw new Error("User has no email address");

      const seat = payment.subscriptionId.seatId;
      const capitalizedName = payment.userId.name.replace(
        /\b\w/g,
        (l: string) => l.toUpperCase(),
      );

      const link = await this.receiptLink(id, library);
      const baseUrl = process.env.ONLINE_URL?.replace(/\/$/, "") || "";
      const fullLink = `${baseUrl}${link}`;

      const htmlBody = MailTemplates.paymentReceipt(payment, library, fullLink);

      return await mail(
        `"${library.name}" <onboarding@library-sms.vercel.app>`,
        userEmail,
        `Payment Receipt - ${payment.receiptNumber}`,
        htmlBody,
      );
    } catch (error) {
      throw error;
    }
  }

  static async receiptLink(id:string , library:any){
    try {
      const payment: any = await this.getPaymentById(id);
      if (!payment) throw new Error("Payment not found");
      const linkId = JWTHelper.generateToken({ id, libraryId: library._id }, { expiresIn: '24h' });
      const link = `/receipt/${linkId}`;
      return link;
    } catch (error) {
      throw error;
    }
  }
}
