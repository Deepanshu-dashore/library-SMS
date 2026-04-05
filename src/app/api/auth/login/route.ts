import { LibraryController } from "@/app/lib/featuers/library/library.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return await LibraryController.loginLibrary(req);
}