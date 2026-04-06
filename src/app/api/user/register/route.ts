import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

/**
 * Public registration endpoint
 * No JWT required
 */
export async function POST(req: NextRequest) {
  return await UserController.publicCreateUserController(req);
}
