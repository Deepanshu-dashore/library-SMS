import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

/**
 * DELETE /api/user/deep-delete/[id]
 *
 * Permanently removes a user that has already been moved to trash.
 *
 * Responses:
 *  200 – User permanently deleted.
 *  400 – User is not in trash yet.
 *  401 – Unauthorized (missing / invalid JWT).
 *  404 – User not found.
 *  409 – User has an active subscription; cancel it first.
 *  500 – Internal server error.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await UserController.deepDeleteUserController(req, { params });
}
