import { PaymentController } from "@/app/lib/featuers/payment/payment.controller";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await PaymentController.sendReceiptEmail(params);
}
