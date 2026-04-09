import { PaymentController } from "@/app/lib/featuers/payment/payment.controller";

export async function GET() {
  return await PaymentController.getAllPayments();
}
