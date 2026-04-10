import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = Promise.resolve({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  });
  return await UserController.getTrashUserController(req, { query });
}
