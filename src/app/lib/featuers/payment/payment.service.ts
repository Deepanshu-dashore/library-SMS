  import { mail } from "../../services/mail.service";
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

      const htmlBody = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #312c85; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">PAYMENT RECEIPT</h1>
            <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 14px;">Receipt #${payment.receiptNumber}</p>
          </div>
          
          <div style="padding: 32px; background-color: #ffffff;">
            <div style="margin-bottom: 24px;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600;">Billed To</p>
              <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 18px; font-weight: 700;">${capitalizedName}</p>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 14px;">${userEmail}</p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Seat Details</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${seat?.seatNumber} (${seat?.type?.toUpperCase()})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Floor</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${seat?.floor || "Ground"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Period</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${new Date(payment.subscriptionId.startDate).toLocaleDateString("en-GB")} to ${new Date(payment.subscriptionId.endDate).toLocaleDateString("en-GB")}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Payment Mode</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${payment.paymentMode.toUpperCase()}</td>
                </tr>
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 16px 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 700;">Total Amount Paid</td>
                  <td style="padding: 16px 0 8px 0; color: #312c85; font-size: 20px; font-weight: 800; text-align: right;">₹${payment.amount}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px;">
              <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${library.name}</p>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">${library.address}</p>
              <div style="margin-top: 16px; color: #94a3b8; font-size: 12px;">
                <p style="margin: 0;">This is a system generated receipt.</p>
                <p style="margin: 4px 0 0 0;">For any queries, please contact our help desk.</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">© ${new Date().getFullYear()} ${library.name}. All rights reserved.</p>
          </div>
        </div>
      `;

      return await mail(
        `"${library.name}" <onboarding@resend.dev>`,
        userEmail,
        `Payment Receipt - ${payment.receiptNumber}`,
        htmlBody,
      );
    } catch (error) {
      throw error;
    }
  }
}
