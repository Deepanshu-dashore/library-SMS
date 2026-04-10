import { SeatController } from "@/app/lib/featuers/seat/seats.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await SeatController.getTrashSeatController(req);
}
