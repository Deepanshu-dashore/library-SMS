import { LibraryController } from "@/app/lib/featuers/library/library.controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  return await LibraryController.loginLibrary(req, res);
}