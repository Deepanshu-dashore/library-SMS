import { NextRequest } from "next/server";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { SeatService } from "../seat/seats.service";

export class UserController {
  static async createUserController(req: NextRequest) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const body = await req.json();
      const user = await UserService.createUserService(body);
      return ApiResponse(200, user, "User created successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async getVerificationAndSeatController(
    req: NextRequest,
    params: Promise<{ id: string }>,
  ) {
    try {
      const { id } = await params;
      const userData = await UserService.getUserByIdService(id);
      const seat = await SeatService.getSeatByUserIdService(id);
      const user = {
        name: userData.name,
        email: userData.email,
        phone: userData.number,
        status: userData.status,
      };
      return ApiResponse(
        200,
        { user, seat },
        "User status and seat fetched successfully",
      );
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async publicCreateUserController(req: NextRequest) {
    try {
      const body = await req.json();
      const user = await UserService.createUserService(body);
      return ApiResponse(200, user, "User registered successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async getAllUserController(
    req: NextRequest,
    { query }: { query: Promise<{ page: string; limit: string; filter: any }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { page, limit, filter } = await query;
      const users = await UserService.getAllUserService(
        Number(page),
        Number(limit),
        filter || {},
      );
      return ApiResponse(200, users, "Users fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async getUserByIdController(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const user = await UserService.getUserByIdService(id);
      return ApiResponse(200, user, "User fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async updateUserController(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const body = await req.json();
      const user = await UserService.updateUserService(id, body);
      return ApiResponse(200, user, "User updated successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async deleteUserController(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const user = await UserService.deleteUserService(id);
      return ApiResponse(200, user, "User deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }
}
