import { SeatController } from "@/app/lib/featuers/seat/seats.controller";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return await SeatController.softDeleteSeatController(req, params);
}
