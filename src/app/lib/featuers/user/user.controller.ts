import { NextRequest } from "next/server";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { SeatService } from "../seat/seats.service";
import { CloudinaryService } from "../../services/cloudinary.service";
import { getUrls } from "../../utils/geturl";

export class UserController {
  // ── helpers ────────────────────────────────────────────────────────────────

  /** Parse a request that may arrive as multipart/form-data OR application/json.
   *  Returns a plain body object with photo/signature already resolved to
   *  Cloudinary URLs (stored as partial paths, same as publicCreateUserController). */
  private static async parseBodyWithUploads(req: NextRequest): Promise<any> {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      const body: any = {};

      for (const [key, value] of fd.entries()) {
        // photo / signature are handled separately
        if (key === "photo" || key === "signature") continue;

        if (key.startsWith("address.")) {
          if (!body.address) body.address = {};
          body.address[key.split(".")[1]] = value;
        } else {
          body[key] = value;
        }
      }

      const photoRaw = fd.get("photo");
      const signatureRaw = fd.get("signature");

      if (photoRaw) {
        body.photo =
          (await CloudinaryService.upload(photoRaw, "user", "image"))?.url ||
          "";
      }
      if (signatureRaw) {
        body.signature =
          (await CloudinaryService.upload(signatureRaw, "user", "image"))
            ?.url || "";
      }

      return body;
    }

    const body = await req.json();
    // If JSON request contains base64 strings, upload them to Cloudinary
    if (body.photo && body.photo.startsWith("data:image")) {
      body.photo =
        (await CloudinaryService.upload(body.photo, "user", "image"))?.url ||
        "";
    }
    if (body.signature && body.signature.startsWith("data:image")) {
      body.signature =
        (await CloudinaryService.upload(body.signature, "user", "image"))
          ?.url || "";
    }
    return body;
  }

  /** Delete photo + signature from Cloudinary if they exist on a user doc. */
  private static async deleteUserImages(user: any) {
    if (!user) return;
    if (user.photo) await CloudinaryService.delete(user.photo, "image");
    if (user.signature) await CloudinaryService.delete(user.signature, "image");
  }

  // ── controllers ────────────────────────────────────────────────────────────

  static async createUserController(req: NextRequest) {
    const library = await verifyJWT();
    if (!library) return ApiResponse(401, null, "Unauthorized");

    try {
      const body = await UserController.parseBodyWithUploads(req);
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
        name: userData?.user?.name,
        email: userData?.user?.email,
        phone: userData?.user?.number,
        status: userData?.user?.status,
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

        const photoRaw = formData.get("photo");
        const signatureRaw = formData.get("signature");

        if (photoRaw) {
          body.photo =
            (await CloudinaryService.upload(photoRaw, "user", "image"))?.url ||
            "";
        }
        if (signatureRaw) {
          body.signature =
            (await CloudinaryService.upload(signatureRaw, "user", "image"))
              ?.url || "";
        }
      } else {
        body = await req.json();
        if (body.photo && body.photo.startsWith("data:image")) {
          body.photo =
            (await CloudinaryService.upload(body.photo, "user", "image"))
              ?.url || "";
        }
        if (body.signature && body.signature.startsWith("data:image")) {
          body.signature =
            (await CloudinaryService.upload(body.signature, "user", "image"))
              ?.url || "";
        }
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
        if (user.user.photo)
          user.user.photo = getUrls.getUrl(user.user.photo, "image");
        if (user.user.signature)
          user.user.signature = getUrls.getUrl(user.user.signature, "image");
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
    if (!library) return ApiResponse(401, null, "Unauthorized");

    try {
      const { id } = await params;

      // Fetch existing user so we can delete old images if they are replaced
      const existing: any = await UserService.getUserByIdService(id);

      const contentType = req.headers.get("content-type") || "";
      let body: any = {};

      if (contentType.includes("multipart/form-data")) {
        const fd = await req.formData();
        for (const [key, value] of fd.entries()) {
          if (key === "photo" || key === "signature") continue;
          if (key.startsWith("address.")) {
            if (!body.address) body.address = {};
            body.address[key.split(".")[1]] = value;
          } else {
            body[key] = value;
          }
        }

        const photoRaw = fd.get("photo");
        const signatureRaw = fd.get("signature");

        if (photoRaw) {
          if (existing?.photo)
            await CloudinaryService.delete(existing.photo, "image");
          body.photo =
            (await CloudinaryService.upload(photoRaw, "user", "image"))?.url ||
            "";
        }
        if (signatureRaw) {
          if (existing?.signature)
            await CloudinaryService.delete(existing.signature, "image");
          body.signature =
            (await CloudinaryService.upload(signatureRaw, "user", "image"))
              ?.url || "";
        }
      } else {
        body = await req.json();
        // Base64 handling for updates
        if (body.photo && body.photo.startsWith("data:image")) {
          if (existing?.photo)
            await CloudinaryService.delete(existing.photo, "image");
          body.photo =
            (await CloudinaryService.upload(body.photo, "user", "image"))
              ?.url || "";
        }
        if (body.signature && body.signature.startsWith("data:image")) {
          if (existing?.signature)
            await CloudinaryService.delete(existing.signature, "image");
          body.signature =
            (await CloudinaryService.upload(body.signature, "user", "image"))
              ?.url || "";
        }
      }

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
    if (!library) return ApiResponse(401, null, "Unauthorized");

    try {
      const { id } = await params;

      // Fetch user before deletion so we can remove Cloudinary assets
      const existing = await UserService.getUserByIdService(id);
      const user = await UserService.deleteUserService(id); // throws if active subscription
      await UserController.deleteUserImages(existing); // fires after DB delete succeeds

      return ApiResponse(200, user, "User deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error.message || error);
    }
  }

  static async softDeleteUserController(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const library = await verifyJWT();
    if (!library) return ApiResponse(401, null, "Unauthorized");

    try {
      const { id } = await params;

      // Fetch before soft-delete to retrieve image paths
      const existing = await UserService.getUserByIdService(id);
      const user = await UserService.softDeleteUserService(id);
      await UserController.deleteUserImages(existing); // remove Cloudinary assets

      return ApiResponse(200, user, "User moved to trash successfully");
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
