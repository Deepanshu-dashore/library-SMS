import { verifyJWT } from "../../middlewares/verifyJWT";
import { comparePasswords, hashPassword } from "../../security/password";
import { ApiResponse } from "../../utils/ApiResponse";
import { JWTHelper } from "../../utils/JWTHelper";
import { LibraryService } from "./library.service";
import { NextRequest, NextResponse } from "next/server";

export class LibraryController {
  static async createLibrary(req: NextRequest, res: NextResponse) {
    try {
      const body = await req.json();
      const { name, email, password } = body;
      if (!name || !email || !password) {
        return ApiResponse(400, null, "All fields are required");
      }
      const existingLibrary = await LibraryService.getLibraryByEmail(email);
      if (existingLibrary) {
        return ApiResponse(400, null, "Library already exists");
      }
      const hashedPassword = await hashPassword(password);
      const library = await LibraryService.createLibrary({
        name,
        email,
        password: hashedPassword,
      });
      return ApiResponse(200, library, "Library created successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async loginLibrary(req: NextRequest, res: NextResponse) {
    try {
      const body = await req.json();
      const { email, password } = body;
      if (!email || !password) {
        return ApiResponse(400, null, "All fields are required");
      }
      const existingLibrary = await LibraryService.getLibraryByEmail(email);
      if (!existingLibrary) {
        return ApiResponse(404, null, "Library not found");
      }
      const isPasswordValid = await comparePasswords(
        password,
        existingLibrary.password,
      );
      if (!isPasswordValid) {
        return ApiResponse(401, null, "Invalid password");
      }
      const token = JWTHelper.generateToken({ id: existingLibrary._id });
      const response = NextResponse.json(
        {
          success: true,
          message: "Login successful",
          data: {
            id: existingLibrary._id,
            name: existingLibrary.name,
            email: existingLibrary.email,
          },
        },
        { status: 200 },
      );

      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return response;
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async updateLibrary(
    req: NextRequest,
    res: NextResponse,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const { id } = await params;
      const body = await req.json();
      const result = await LibraryService.updateLibrary(body, id);
      return ApiResponse(200, result, "Library updated successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async deleteLibrary(
    req: NextRequest,
    res: NextResponse,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const { id } = await params;
      const result = await LibraryService.deleteLibrary(id);
      return ApiResponse(200, result, "Library deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async getLibrary(
    req: NextRequest,
    res: NextResponse,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const { id } = await params;
      const result = await LibraryService.getLibrary(id);
      return ApiResponse(200, result, "Library fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async getAllLibraries(req: NextRequest, res: NextResponse) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const result = await LibraryService.getAllLibraries();
      return ApiResponse(200, result, "Libraries fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }
}
