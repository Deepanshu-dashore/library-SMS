import { NextRequest } from "next/server";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { SeatService } from "../seat/seats.service";
import { CloudinaryService } from "../../services/cloudinary.service";
import { getUrls } from "../../utils/geturl";

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

  static async getVerificationAndSeat(
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
      const contentType = req.headers.get("content-type") || "";
      let body: any = {};

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          if (key === "photo" || key === "signature") continue;
          if (key.startsWith("address.")) {
            if (!body.address) body.address = {};
            body.address[key.split(".")[1]] = value;
          } else {
            body[key] = value;
          }
        }

        const photoFile = formData.get("photo") as File | null;
        const signatureFile = formData.get("signature") as File | null;

        if (photoFile && photoFile.size > 0) {
          body.photo =
            (await CloudinaryService.upload(photoFile, "user", "image"))?.url ||
            "";
        }
        if (signatureFile && signatureFile.size > 0) {
          body.signature =
            (await CloudinaryService.upload(signatureFile, "user", "image"))
              ?.url || "";
        }
      } else {
        body = await req.json();
      }

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
      if (users && users.users) {
        users.users = users.users.map((u: any) => {
          if (u.photo) u.photo = getUrls.getUrl(u.photo, "image");
          if (u.signature) u.signature = getUrls.getUrl(u.signature, "image");
          return u;
        });
      }
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
      const user: any = await UserService.getUserByIdService(id);
      if (user) {
        if (user.photo) user.photo = getUrls.getUrl(user.photo, "image");
        if (user.signature)
          user.signature = getUrls.getUrl(user.signature, "image");
      }
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
      const user: any = await UserService.updateUserService(id, body);
      if (user) {
        if (user.photo) user.photo = getUrls.getUrl(user.photo, "image");
        if (user.signature)
          user.signature = getUrls.getUrl(user.signature, "image");
      }
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

  static async softDeleteUserController(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const user = await UserService.softDeleteUserService(id);
      return ApiResponse(200, user, "User deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async restoreUserController(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { id } = await params;
      const user = await UserService.restoreUserService(id);
      return ApiResponse(200, user, "User restored successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async getTrashUserController(
    req: NextRequest,
    { query }: { query: Promise<{ page: string; limit: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized");
    }
    try {
      const { page, limit } = await query;
      const users = await UserService.getTrashUserService(
        Number(page),
        Number(limit),
      );
      if (users && users.users) {
        users.users = users.users.map((u: any) => {
          if (u.photo) u.photo = getUrls.getUrl(u.photo, "image");
          if (u.signature) u.signature = getUrls.getUrl(u.signature, "image");
          return u;
        });
      }
      return ApiResponse(200, users, "Trash users fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }
}
