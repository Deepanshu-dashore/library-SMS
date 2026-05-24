import type { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/userSlice";

/**
 * Fast logout: clears client state instantly, fires cookie cleanup in the
 * background, and hard-navigates to /login without waiting for the server.
 */
export function clientLogout(dispatch: AppDispatch): void {
  // 1. Immediately clear Redux user state (instant UI feedback)
  dispatch(logoutUser());

  // 2. Nuke any browser-accessible cookies as a safety net
  document.cookie = "__lms_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;";

  // 3. Fire server cookie cleanup in background (don't block on it)
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    keepalive: true, // ensures the request completes even during navigation
  }).catch(() => {
    // swallow — cookie is already nuked client-side, server will
    // reject stale tokens anyway on next request.
  });

  // 4. Hard-navigate to login immediately
  window.location.href = "/login";
}
