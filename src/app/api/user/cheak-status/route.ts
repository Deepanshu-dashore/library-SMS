import { NextRequest } from "next/server";
import { UserController } from "@/app/lib/featuers/user/user.controller";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id") || "";
  return await UserController.getVerificationAndSeat(
    req,
    Promise.resolve({ id }),
  );
}
