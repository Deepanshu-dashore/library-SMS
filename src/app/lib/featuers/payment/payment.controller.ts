import { ApiResponse } from "../../utils/ApiResponse";
import { PaymentService } from "./payment.service";
import { verifyJWT } from "../../middlewares/verifyJWT";

export class PaymentController {
  static async getAllPayments() {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const payments = await PaymentService.getAllPayment();
      return ApiResponse(200, payments, "Payments fetched successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch payments");
    }
  }

  static async getPaymentById(params: Promise<{ id: string }>) {
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
