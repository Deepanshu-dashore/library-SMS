import { NextRequest } from "next/server";
import { SeatController } from "@/app/lib/featuers/seat/seats.controller";

export async function GET(req: NextRequest) {
  return await SeatController.getAllSeatController(req);
}

export async function POST(req: NextRequest) {
  return await SeatController.createSeatController(req);
}
