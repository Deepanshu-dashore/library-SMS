import { NextRequest } from "next/server";
import { DashboardController } from "../../lib/featuers/dashboard/dashboard.controller";

export async function GET(req: NextRequest) {
  return await DashboardController.getDashboardController(req);
}
