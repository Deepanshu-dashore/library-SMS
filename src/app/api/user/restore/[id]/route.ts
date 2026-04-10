import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await UserController.restoreUserController(req, { params });
}
