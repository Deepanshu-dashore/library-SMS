import { NextRequest } from "next/server";
import { UserController } from "@/app/lib/featuers/user/user.controller";

/**
 * Handle dynamic student status check
 * GET /api/user/cheak-status/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return await UserController.getVerificationAndSeatController(req, params);
}
