import { NextRequest, NextResponse } from "next/server";
import { JWTHelper } from "@/app/lib/utils/JWTHelper";
import { PaymentService } from "@/app/lib/featuers/payment/payment.service";
import { LibraryService } from "@/app/lib/featuers/library/library.service";
import { connectDB } from "@/app/lib/db/connectDB";
import { getUrls } from "@/app/lib/utils/geturl";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await connectDB();
    const { token } = await params;
    
    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
    }

    let decoded: any;
    try {
      decoded = JWTHelper.verifyToken(token);
    } catch (error) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const { id, libraryId } = decoded;

    if (!id) {
      return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 400 });
    }

    const [payment, library] = await Promise.all([
      PaymentService.getPaymentById(id),
      libraryId ? LibraryService.getLibrary(libraryId) : null
    ]);

    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment not found" }, { status: 404 });
    }

    // Convert logo and signature to full URLs if they exist
    if (library) {
      if (library.logo) library.logo = getUrls.getUrl(library.logo);
      if (library.signature) library.signature = getUrls.getUrl(library.signature);
    }

    return NextResponse.json({
      success: true,
      data: {
        payment,
        library
      }
    });

  } catch (error: any) {
    console.error("Receipt API Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
