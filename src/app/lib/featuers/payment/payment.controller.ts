import { ApiResponse } from "../../utils/ApiResponse";
import { PaymentService } from "./payment.service";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { connectDB } from "../../db/connectDB";

export class PaymentController {
  static async getAllPayments(req: Request) {
    await connectDB();
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const mode = searchParams.get("mode") || "All";

    try {
      const { payments, stats } = await PaymentService.getAllPayment(search, mode);
      return ApiResponse(200, { payments, stats }, "Payments fetched successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch payments");
    }
  }

  static async getPaymentById(params: Promise<{ id: string }>) {
    await connectDB();
    const library = await verifyJWT();
    if (!library) {
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
}
