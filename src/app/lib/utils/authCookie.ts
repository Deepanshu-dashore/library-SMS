/** Shared options for the LMS auth cookie (`__lms_token`). */
export const AUTH_COOKIE_NAME = "__lms_token";

const isProduction = process.env.NODE_ENV === "production";

export function authCookieSetOptions(maxAgeSeconds = 60 * 60 * 24) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/** Expire / remove the auth cookie (must match flags used when setting it). */
export function authCookieClearOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
