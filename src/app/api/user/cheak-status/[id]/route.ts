import { NextRequest } from "next/server";
import { UserController } from "@/app/lib/featuers/user/user.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await UserController.getVerificationAndSeat(req, params);
}
