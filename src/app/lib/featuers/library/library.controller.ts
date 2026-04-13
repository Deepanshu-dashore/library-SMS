import { verifyJWT } from "../../middlewares/verifyJWT";
import { comparePasswords, hashPassword } from "../../security/password";
import { CloudinaryService } from "../../services/cloudinary.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { getUrls } from "../../utils/geturl";
import { JWTHelper } from "../../utils/JWTHelper";
import { LibraryService } from "./library.service";
import { NextRequest, NextResponse } from "next/server";

export class LibraryController {
  static async createLibrary(req: NextRequest) {
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

  static async loginLibrary(req: NextRequest) {
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

  static async getLibraryFloors(req: NextRequest) {
    try {
      const library: any = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const result = await LibraryService.getLibraryFloors(library.id);
      return ApiResponse(200, result, "Library floors fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async updateLibrary(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const { id } = await params;
      const existingLibrary = await LibraryService.getLibrary(id);
      if (!existingLibrary) {
        return ApiResponse(404, null, "Library not found");
      }
      const formData = await req.formData();
      const file = formData.get("logo") as File | null;
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const address = formData.get("address") as string;
      const helpDesk = formData.get("helpDesk") as string;
      const floors = formData.get("floors") as string;

      let logoUrl = existingLibrary.logo;
      if (file && file.size > 0) {
        if (existingLibrary.logo) {
          await CloudinaryService.delete(existingLibrary.logo);
        }
        logoUrl =
          (await CloudinaryService.upload(file, "library", "image"))?.url || "";
      }
      let parsedHelpDesk = existingLibrary.helpDesk;
      if (typeof helpDesk === "string" && helpDesk.trim().startsWith("{")) {
        try { parsedHelpDesk = JSON.parse(helpDesk); } catch (e) {}
      }
      let parsedFloors = existingLibrary.floors;
      if (typeof floors === "string" && floors.trim().startsWith("[")) {
        try { parsedFloors = JSON.parse(floors); } catch (e) {}
      }

      const result = await LibraryService.updateLibrary(
        {
          name,
          email,
          phone,
          address,
          helpDesk: parsedHelpDesk,
          floors: parsedFloors,
          logo: logoUrl,
        },
        id,
      );
      if (result && result.logo) {
        result.logo = getUrls.getUrl(result.logo);
      }
      if (result && result.signature) {
        result.signature = getUrls.getUrl(result.signature);
      }
      return ApiResponse(200, result, "Library updated successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async deleteLibrary(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const { id } = await params;
      const existingLibrary = await LibraryService.getLibrary(id);
      if (!existingLibrary) {
        return ApiResponse(404, null, "Library not found");
      }
      if (existingLibrary.logo) {
        await CloudinaryService.delete(existingLibrary.logo);
      }
      const result = await LibraryService.deleteLibrary(id);
      return ApiResponse(200, result, "Library deleted successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async getLibrary(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const { id } = await params;
      const result = await LibraryService.getLibrary(id);
      if (!result) {
        return ApiResponse(404, null, "Library not found");
      }
      const buildUrl = getUrls.getUrl(result.logo);
      result.logo = buildUrl;
      if (result.signature) {
        result.signature = getUrls.getUrl(result.signature);
      }
      return ApiResponse(200, result, "Library fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async getAllLibraries(req: NextRequest) {
    try {
      const library = await verifyJWT();
      if (!library) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const result = await LibraryService.getAllLibraries();
      const libraries = result.map((library: any) => {
        library.logo = getUrls.getUrl(library.logo);
        if (library.signature) {
          library.signature = getUrls.getUrl(library.signature);
        }
        return library;
      });
      return ApiResponse(200, libraries, "Libraries fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async getProfile(req: NextRequest) {
    try {
      const payload = await verifyJWT();
      if (!payload || !payload.id) {
        return ApiResponse(401, null, "Unauthorized request");
      }
      const result = await LibraryService.getLibrary(payload.id);
      if (result && result.logo) {
        result.logo = getUrls.getUrl(result.logo);
      }
      if (result && result.signature) {
        result.signature = getUrls.getUrl(result.signature);
      }
      return ApiResponse(200, result, "Library fetched successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }

  static async updateProfile(req: NextRequest) {
    try {
      const payload = await verifyJWT();
      if (!payload || !payload.id) {
        return ApiResponse(401, null, "Unauthorized request");
      }

      const existingLibrary = await LibraryService.getLibrary(payload.id);
      if (!existingLibrary) {
        return ApiResponse(404, null, "Library not found");
      }

      const contentType = req.headers.get("content-type") || "";
      let updateData: any = {};
      let logoUrl = existingLibrary.logo;
      let signatureUrl = existingLibrary.signature;

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const file = formData.get("logo") as File | null;
        const signatureFile = formData.get("signature") as File | null;

        let parsedHelpDeskForm = existingLibrary.helpDesk;
        const helpDeskStr = formData.get("helpDesk") as string;
        if (typeof helpDeskStr === "string" && helpDeskStr.trim().startsWith("{")) {
          try {
            parsedHelpDeskForm = JSON.parse(helpDeskStr);
          } catch (e) {}
        }

        let parsedFloorsForm = existingLibrary.floors;
        const floorsStr = formData.get("floors") as string;
        if (typeof floorsStr === "string" && floorsStr.trim().startsWith("[")) {
          try {
            parsedFloorsForm = JSON.parse(floorsStr);
          } catch (e) {}
        }

        updateData = {
          name: formData.get("name") || existingLibrary.name,
          email: formData.get("email") || existingLibrary.email,
          phone: formData.get("phone") || existingLibrary.phone,
          address: formData.get("address") || existingLibrary.address,
          helpDesk: parsedHelpDeskForm,
          floors: parsedFloorsForm,
        };

        if (file && file.size > 0) {
          if (existingLibrary.logo) {
            await CloudinaryService.delete(existingLibrary.logo);
          }
          logoUrl =
            (await CloudinaryService.upload(file, "library", "image"))?.url ||
            "";
        }

        if (signatureFile && signatureFile.size > 0) {
          if (existingLibrary.signature) {
            await CloudinaryService.delete(existingLibrary.signature);
          }
          signatureUrl =
            (await CloudinaryService.upload(signatureFile, "library", "image"))
              ?.url || "";
        }
      } else {
        updateData = await req.json();
        logoUrl = updateData.logo || existingLibrary.logo;
        signatureUrl = updateData.signature || existingLibrary.signature;
      }

      updateData.logo = logoUrl;
      updateData.signature = signatureUrl;

      const result = await LibraryService.updateLibrary(updateData, payload.id);
      if (result && result.logo) {
        result.logo = getUrls.getUrl(result.logo);
      }
      if (result && result.signature) {
        result.signature = getUrls.getUrl(result.signature);
      }
      return ApiResponse(200, result, "Library profile updated successfully");
    } catch (error: any) {
      return ApiResponse(500, null, error);
    }
  }
}
