import { SubscriptionController } from "@/app/lib/featuers/subscription/subscription.controller";

export async function GET() {
  return await SubscriptionController.getAllSubscription();
}

export async function POST(req: Request) {
  return await SubscriptionController.createSubscription(req);
}
