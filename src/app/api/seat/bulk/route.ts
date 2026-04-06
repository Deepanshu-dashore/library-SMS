import { NextRequest } from "next/server";
import { SeatController } from "@/app/lib/featuers/seat/seats.controller";

export async function POST(req: NextRequest) {
  return await SeatController.createMultipleSeatController(req);
}
