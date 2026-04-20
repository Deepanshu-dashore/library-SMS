import { NextRequest } from "next/server";
import { DashboardService } from "./dashboard.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { verifyJWT } from "../../middlewares/verifyJWT";

export class DashboardController {
  static async getDashboardController(req: NextRequest) {
    const admin = await verifyJWT();
    if (!admin) return ApiResponse(401, null, "Unauthorized");

    try {
      // You can pull filters from req.nextUrl.searchParams if needed
      const data = await DashboardService.getDashbordData({});
      return ApiResponse(200, data, "Dashboard data fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
}
