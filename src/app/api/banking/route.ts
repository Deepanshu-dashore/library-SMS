import { BankingController } from "@/app/lib/featuers/banking/banking.controller";

export async function GET(req: Request) {
  return await BankingController.getBankingDashboardData(req);
}
