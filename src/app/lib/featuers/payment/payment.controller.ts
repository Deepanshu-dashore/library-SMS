import { ApiResponse } from "../../utils/ApiResponse";
import { PaymentService } from "./payment.service";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { connectDB } from "../../db/connectDB";
import { Library } from "../library/library.model";

export class PaymentController {
  static async getAllPayments(req: Request) {
    await connectDB();
    const libraryInfo = await verifyJWT();
    if (!libraryInfo) {
      return ApiResponse(401, null, "Unauthorized");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const mode = searchParams.get("mode") || "All";

    try {
      const { payments, stats } = await PaymentService.getAllPayment(
        search,
        mode,
      );
      return ApiResponse(
        200,
        { payments, stats },
        "Payments fetched successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch payments");
    }
  }

  static async getPaymentById(params: Promise<{ id: string }>) {
    await connectDB();
    const libraryInfo = await verifyJWT();
    if (!libraryInfo) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { id } = await params;
    try {
      const payment = await PaymentService.getPaymentById(id);
      return ApiResponse(200, payment, "Payment fetched successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch payment");
    }
  }

  static async sendReceiptEmail(params: Promise<{ id: string }>) {
    await connectDB();
    const libraryInfo = await verifyJWT();
    if (!libraryInfo || !libraryInfo.id) {
      return ApiResponse(401, null, "Unauthorized");
    }

    const fullLibrary = await Library.findById(libraryInfo.id);
    if (!fullLibrary) {
      return ApiResponse(404, null, "Library profile not found");
    }

    const { id } = await params;
    try {
      const res = await PaymentService.sendReceiptEmail(id, fullLibrary);
      console.log(res);
      return ApiResponse(200, null, "Receipt email sent successfully");
    } catch (error: any) {
      return ApiResponse(
        500,
        null,
        error.message || "Failed to send receipt email",
      );
    }
  }
}
