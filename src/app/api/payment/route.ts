import { PaymentController } from "@/app/lib/featuers/payment/payment.controller";

export async function GET(req: Request) {
  return await PaymentController.getAllPayments(req);
}
