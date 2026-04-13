import { SubscriptionController } from "@/app/lib/featuers/subscription/subscription.controller";

export async function GET(req: Request) {
  return await SubscriptionController.getAllSubscription(req);
}

export async function POST(req: Request) {
  return await SubscriptionController.createSubscription(req);
}
