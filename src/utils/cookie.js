import { COOKIE_OPTIONS } from "./constants.js";

export const setAuthCookies = (
  res,
  accessToken = null,
  refreshToken = null
) => {
  if (accessToken === null && refreshToken === null) {
    // Logout scenario: clear cookies
    res.clearCookie("accessToken", {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
    });
    res.clearCookie("refreshToken", {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
    });
    return;
  }

  // Access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    maxAge: COOKIE_OPTIONS.accessTokenTime,
  });

  // Refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: COOKIE_OPTIONS.httpOnly,
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    maxAge: COOKIE_OPTIONS.refreshTokenTime,
  });
};
