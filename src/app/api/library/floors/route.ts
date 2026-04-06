import { LibraryController } from "@/app/lib/featuers/library/library.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return LibraryController.getLibraryFloors(req);
}
