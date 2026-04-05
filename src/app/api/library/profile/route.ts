import { LibraryController } from "@/app/lib/featuers/library/library.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await LibraryController.getProfile(req);
}

export async function PUT(req: NextRequest) {
  return await LibraryController.updateProfile(req);
}
