import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/app/lib/featuers/payment/payment.service";
import { connectDB } from "@/app/lib/db/connectDB";
import { LibraryService } from "@/app/lib/featuers/library/library.service";
import { verifyJWT } from "@/app/lib/middlewares/verifyJWT";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const libraryInfo = await verifyJWT();
    if (!libraryInfo || !libraryInfo.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const library = await LibraryService.getLibrary(libraryInfo.id);
    if (!library) {
      return NextResponse.json({ success: false, message: "Library not found" }, { status: 404 });
    }

    const link = await PaymentService.receiptLink(id, library);
    const fullLink = `${new URL(req.url).origin}${link}`;

    return NextResponse.json({
      success: true,
      link: fullLink
    });

  } catch (error: any) {
    console.error("Share Link API Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
