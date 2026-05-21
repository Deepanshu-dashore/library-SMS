import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, authCookieClearOptions } from "@/app/lib/utils/authCookie";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, "", authCookieClearOptions());
    response.cookies.delete(AUTH_COOKIE_NAME);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
