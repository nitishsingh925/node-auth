export const setAuthCookies = (res, accessToken, refreshToken) => {
  // Access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict", // or 'None' if cross-domain
    maxAge: 1000 * 15, // 15 seconds
  });

  // Refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict", // or 'None' if cross-domain
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
