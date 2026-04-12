import { Library } from "@/app/lib/featuers/library/library.model";
import { verifyJWT } from "@/app/lib/middlewares/verifyJWT";
import { ApiResponse } from "@/app/lib/utils/ApiResponse";
import { getUrls } from "@/app/lib/utils/geturl";

export async function GET(req: Request) {
  try {
    const library = await verifyJWT();
    if (!library) {
      return ApiResponse(401, null, "Unauthorized request");
    }
    const user = await Library.findById(library.id)
      .select("name email logo")
      .lean();
    if (!user) {
      return ApiResponse(404, null, "User not found");
    }
    return ApiResponse(
      200,
      { ...user, logo: user.logo ? getUrls.getUrl(user.logo, "image") : "" },
      "User verified successfully",
    );
  } catch (error: any) {
    return ApiResponse(500, null, error);
  }
}
