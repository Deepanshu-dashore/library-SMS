import { SubscriptionController } from "@/app/lib/featuers/subscription/subscription.controller";

export async function POST(req: Request) {
  return await SubscriptionController.cancelSubscription(req);
}
