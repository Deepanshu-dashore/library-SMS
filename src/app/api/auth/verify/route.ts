import { verifyJWT } from "@/app/lib/middlewares/verifyJWT";
import { ApiResponse } from "@/app/lib/utils/ApiResponse";

export async function GET(req: Request) {
  try {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    return ApiResponse(200, library, "Library verified successfully");
  } catch (error: any) {
    return ApiResponse(500, null, error);
  }
}
