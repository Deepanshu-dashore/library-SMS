import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await UserController.verifyUser(req, { params });
}
