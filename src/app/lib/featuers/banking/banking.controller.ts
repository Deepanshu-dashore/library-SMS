import { verifyJWT } from "../../middlewares/verifyJWT";
import { ApiResponse } from "../../utils/ApiResponse";
import { BankingService } from "./banking.service";

export class BankingController {
  static async getBankingDashboardData(req: Request) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    try {
      const { searchParams } = new URL(req.url);
      const yearParam = searchParams.get("year");
      const monthParam = searchParams.get("month");

      const year = yearParam ? parseInt(yearParam, 10) : undefined;
      const month = monthParam ? parseInt(monthParam, 10) : undefined;

      const data = await BankingService.getBankingData(year, month);

      return ApiResponse(200, data, "Banking dashboard data fetched successfully");
    } catch (error) {
      return ApiResponse(500, null, "Failed to fetch banking dashboard data");
    }
  }
}
