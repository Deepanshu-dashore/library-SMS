import { NextRequest } from "next/server";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { ApiResponse } from "../../utils/ApiResponse";
import { SeatService } from "./seats.service";

export class SeatController {
  static async createSeatController(req: NextRequest) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const { seatNumber, price, floor, type } = await req.json();
    if (!seatNumber) {
      return ApiResponse(400, null, "Seat Number is required");
    }
    if (!price) {
      return ApiResponse(400, null, "Price is required");
    }
    if (!floor) {
      return ApiResponse(400, null, "Floor is required");
    }
    if (!type) {
      return ApiResponse(400, null, "Type is required");
    }
    try {
      const seat = await SeatService.createSeatService({
        seatNumber,
        price,
        floor,
        type,
      });
      return ApiResponse(200, seat, "Seat created successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
  static async createMultipleSeatController(req: NextRequest) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    const seats: any[] = await req.json();
    if (!seats) {
      return ApiResponse(400, null, "Seats are required");
    }
    for (const seat of seats) {
      if (!seat.seatNumber) {
        return ApiResponse(400, null, "Seat Number is required");
      }
      if (!seat.price) {
        return ApiResponse(400, null, "Price is required");
      }
      if (!seat.floor) {
        return ApiResponse(400, null, "Floor is required");
      }
      if (!seat.type) {
        return ApiResponse(400, null, "Type is required");
      }
    }
    try {
      const seat = await SeatService.createMultipleSeatService(seats);
      return ApiResponse(200, seat, "Seat created successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
  static async getAllSeatController(req: NextRequest) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { searchParams } = new URL(req.url);
      const floor  = searchParams.get("floor")  || undefined;
      const status = searchParams.get("status") || undefined;
      const type   = searchParams.get("type")   || undefined;
      const page   = parseInt(searchParams.get("page") || "1");
      const limit  = parseInt(searchParams.get("limit") || "10");
      
      const seat = await SeatService.getAllSeatService({ floor, status, type, page, limit });
      return ApiResponse(200, seat, "Seat fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
  static async getSeatByUserIdController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const seat = await SeatService.getSeatByUserIdService(id);
      return ApiResponse(200, seat, "Seat fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
  static async getSeatByIdController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const seat = await SeatService.getSeatByIdService(id);
      return ApiResponse(200, seat, "Seat fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
  static async updateSeatController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const body = await req.json();
      const seat = await SeatService.updateSeatService(id, body);
      return ApiResponse(200, seat, "Seat updated successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
  static async softDeleteSeatController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const seat = await SeatService.softDeleteSeatService(id);
      return ApiResponse(200, seat, "Seat deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async deleteSeatController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const seat = await SeatService.deleteSeatService(id);
      return ApiResponse(200, seat, "Seat permanently deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async restoreSeatController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const seat = await SeatService.restoreSeatService(id);
      return ApiResponse(200, seat, "Seat restored successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async getTrashSeatController(req: NextRequest) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const seat = await SeatService.getTrashSeatService();
      return ApiResponse(200, seat, "Trash seats fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
}
