import { SubscriptionController } from "@/app/lib/featuers/subscription/subscription.controller";

export async function GET(req: Request) {
  return await SubscriptionController.getSeatCalender(req);
}
