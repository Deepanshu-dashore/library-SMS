import { UserController } from "@/app/lib/featuers/user/user.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "All";
  const search = searchParams.get("search") || "";

  const filter: any = {};
  if (status !== "All") {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const query = Promise.resolve({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
    filter,
  });
  return await UserController.getAllUserController(req, { query });
}

export async function POST(req: NextRequest) {
  return await UserController.createUserController(req);
}
