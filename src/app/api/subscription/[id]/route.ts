import { SubscriptionController } from "@/app/lib/featuers/subscription/subscription.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await SubscriptionController.getSubscription(params);
}
