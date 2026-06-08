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

  static async getPaymentReportData(year: number, month?: number) {
    try {
      const matchStage: any = {};
      
      let startDate: Date;
      let endDate: Date;
      if (month && month > 0) {
        startDate = new Date(Date.UTC(year, month - 1, 1));
        endDate = new Date(Date.UTC(year, month, 1));
      } else {
        startDate = new Date(Date.UTC(year, 0, 1));
        endDate = new Date(Date.UTC(year + 1, 0, 1));
      }
      matchStage.createdAt = { $gte: startDate, $lt: endDate };

      const payments = await Payment.find(matchStage)
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      // Group payments by receiptNumber
      const receiptGroups = new Map<string, any[]>();
      payments.forEach((p) => {
        const key = p.receiptNumber || p._id.toString();
        if (!receiptGroups.has(key)) {
          receiptGroups.set(key, []);
        }
        receiptGroups.get(key)!.push(p.toObject());
      });

      // Calculate totals
      let totalAmount = 0;
      let cashAmount = 0;
      let cashCount = 0;
      let upiAmount = 0;
      let upiCount = 0;
      let cardAmount = 0;
      let cardCount = 0;
      let splitAmount = 0;
      let splitCount = 0;

      const transactions: any[] = [];

      receiptGroups.forEach((groupPayments, receipt) => {
        const first = groupPayments[0];
        const isSplit = groupPayments.length > 1;
        const groupTotal = groupPayments.reduce((s, p) => s + p.amount, 0);

        totalAmount += groupTotal;

        if (isSplit) {
          splitAmount += groupTotal;
          splitCount += 1;
        } else {
          const mode = first.paymentMode;
          if (mode === "cash") {
            cashAmount += groupTotal;
            cashCount += 1;
          } else if (mode === "upi") {
            upiAmount += groupTotal;
            upiCount += 1;
          } else if (mode === "card") {
            cardAmount += groupTotal;
            cardCount += 1;
          }
        }

        transactions.push({
          id: first._id.toString(),
          receiptNumber: receipt,
          userId: first.userId,
          amount: groupTotal,
          paymentMode: isSplit ? "split" : first.paymentMode,
          createdAt: first.createdAt,
          splitDetails: groupPayments,
        });
      });

      // Calculate monthly stats for the selected year
      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2000, i, 1).toLocaleString("default", { month: "short" }),
        total: 0,
        cash: 0,
        upi: 0,
        card: 0,
        split: 0,
      }));

      // We calculate monthly stats based on all payments in the selected year
      // To do this, we need payments for the entire year
      let yearPayments = payments;
      if (month && month > 0) {
        const yrStart = new Date(Date.UTC(year, 0, 1));
        const yrEnd = new Date(Date.UTC(year + 1, 0, 1));
        yearPayments = await Payment.find({
          createdAt: { $gte: yrStart, $lt: yrEnd }
        }).sort({ createdAt: -1 });
      }

      const yearGroups = new Map<string, any[]>();
      yearPayments.forEach((p) => {
        const key = p.receiptNumber || p._id.toString();
        if (!yearGroups.has(key)) {
          yearGroups.set(key, []);
        }
        yearGroups.get(key)!.push(p.toObject());
      });

      yearGroups.forEach((groupPayments) => {
        const first = groupPayments[0];
        const isSplit = groupPayments.length > 1;
        const groupTotal = groupPayments.reduce((s, p) => s + p.amount, 0);
        const m = new Date(first.createdAt).getMonth();

        monthlyStats[m].total += groupTotal;
        if (isSplit) {
          monthlyStats[m].split += groupTotal;
        } else {
          const mode = first.paymentMode;
          if (mode === "cash") {
            monthlyStats[m].cash += groupTotal;
          } else if (mode === "upi") {
            monthlyStats[m].upi += groupTotal;
          } else if (mode === "card") {
            monthlyStats[m].card += groupTotal;
          }
        }
      });

      return {
        totals: {
          totalAmount,
          cash: { amount: cashAmount, count: cashCount },
          upi: { amount: upiAmount, count: upiCount },
          card: { amount: cardAmount, count: cardCount },
          split: { amount: splitAmount, count: splitCount },
        },
        monthlyStats,
        payments: transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      };
    } catch (error) {
      throw error;
    }
  }
}
