import { PaymentController } from "@/app/lib/featuers/payment/payment.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await PaymentController.getPaymentById(params);
}
