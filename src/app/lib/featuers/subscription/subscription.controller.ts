import { ApiResponse } from "../../utils/ApiResponse";
import { SubscriptionService } from "./subsciption.service";
import { verifyJWT } from "../../middlewares/verifyJWT";

export class SubscriptionController {
  static async getAllSubscription() {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const subscriptions = await SubscriptionService.getAllSubscription();
      return ApiResponse(
        200,
        subscriptions,
        "Subscriptions fetched successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch subscriptions");
    }
  }
  static async getSubscription(params: Promise<{ id: string }>) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { id } = await params;
    try {
      const subscription = await SubscriptionService.getSubscription(id);
      return ApiResponse(
        200,
        subscription,
        "Subscription fetched successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch subscription");
    }
  }
  static async createSubscription(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { userId, seatId, durationDays, startDate, paymentMode } =
      await req.json();
    try {
      const subscription = await SubscriptionService.createSubscription(
        userId,
        seatId,
        durationDays,
        startDate,
        paymentMode,
      );
      return ApiResponse(
        200,
        subscription,
        "Subscription created successfully",
      );
    } catch (error: any) {
      return ApiResponse(400, null, error.message || "Failed to create subscription");
    }
  }
  static async transferSubscription(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { subscriptionId, fromSeatId, toSeatId } = await req.json();
    try {
      const subscription = await SubscriptionService.transferSubscription(
        subscriptionId,
        fromSeatId,
        toSeatId,
      );
      return ApiResponse(
        200,
        subscription,
        "Subscription transferred successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to transfer subscription");
    }
  }
  static async cancelSubscription(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { subscriptionId } = await req.json();
    try {
      const subscription =
        await SubscriptionService.cancelSubscription(subscriptionId);
      return ApiResponse(
        200,
        subscription,
        "Subscription cancelled successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to cancel subscription");
    }
  }
  static async renewSubscription(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { subscriptionId, durationDays, paymentMode } = await req.json();
    try {
      const subscription = await SubscriptionService.renewSubscription(
        subscriptionId,
        durationDays,
        paymentMode,
      );
      return ApiResponse(
        200,
        subscription,
        "Subscription renewed successfully",
      );
    } catch (error) {
      return ApiResponse(500, null, "Failed to renew subscription");
    }
  }
}
