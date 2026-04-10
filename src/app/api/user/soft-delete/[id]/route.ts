import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await UserController.softDeleteUserController(req, { params });
}
