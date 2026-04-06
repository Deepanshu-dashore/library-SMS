import { NextRequest } from "next/server";
import { SeatController } from "@/app/lib/featuers/seat/seats.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await SeatController.getSeatByIdController(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await SeatController.updateSeatController(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await SeatController.deleteSeatController(req, params);
}
