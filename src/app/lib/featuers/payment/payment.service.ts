import { mail } from "../../services/mail.service";
import { Payment } from "./payment.model";
import { MailTemplates } from "../../templates/mailTemplates";
import { JWTHelper } from "../../utils/JWTHelper";
import { getUrls } from "../../utils/geturl";

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
          select: "name email",
        })
        .select("-__v")
        .sort({ createdAt: -1 });

      const filteredPayments = search 
        ? payments.filter((p: any) => 
            (p.userId && p.userId.name.toLowerCase().includes(search.toLowerCase())) ||
            (p.receiptNumber && p.receiptNumber.toLowerCase().includes(search.toLowerCase()))
          ) 
        : payments;

      // Group payments by receiptNumber for better display in reports
      const grouped = new Map();
      filteredPayments.forEach((p) => {
        const key = p.receiptNumber;
        if (!grouped.has(key)) {
          grouped.set(key, {
            ...p.toObject(),
            splitDetails: [p.toObject()],
          });
        } else {
          const existing = grouped.get(key);
          existing.amount += p.amount;
          existing.paymentMode = "split";
          existing.splitDetails.push(p.toObject());
        }
      });

      return {
        payments: Array.from(grouped.values()),
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

      if (payment && payment.subscriptionId) {
        const relatedPayments = await Payment.find({
          subscriptionId: payment.subscriptionId._id,
        })
          .select("-__v")
          .sort({ createdAt: 1 });
        return {
          ...payment.toObject(),
          relatedPayments: relatedPayments.map((p) => p.toObject()),
        };
      }

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

      const logo = library.logo ? getUrls.getUrl(library.logo) : "";
      const signature = library.signature ? getUrls.getUrl(library.signature) : "";

      const htmlBody = MailTemplates.paymentReceipt(
        payment,
        { ...library._doc, logo, signature },
        fullLink,
      );

      const fromEmail = process.env.ACCOUNTS_MAIL || "accounts@sawariyalibrary.in";

      return await mail(
        `"${library.name}" <${fromEmail}>`,
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
