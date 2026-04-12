import { NextRequest } from "next/server";
import { SeatController } from "@/app/lib/featuers/seat/seats.controller";

export async function PATCH(req:NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await SeatController.maintanceController(req, params);
}
