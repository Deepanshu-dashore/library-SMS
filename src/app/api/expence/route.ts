import { ExpenceController } from "@/app/lib/featuers/expencess/expence.controller";

export async function GET(req: Request) {
  return await ExpenceController.getAllExpence(req);
}

export async function POST(req: Request) {
  return await ExpenceController.createExpence(req);
}
