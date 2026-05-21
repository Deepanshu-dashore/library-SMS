import type { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/userSlice";

/**
 * Clears server session cookie, Redux user state, then hard-navigates to login.
 */
export async function clientLogout(dispatch: AppDispatch): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch(logoutUser());
    window.location.href = "/login";
    return res.ok;
  } catch {
    dispatch(logoutUser());
    window.location.href = "/login";
    return false;
  }
}
