const isProduction = process.env.NODE_ENV === "production";

export const refreshCookieOptions = {
  // Keep the refresh token inaccessible to browser JavaScript.
  httpOnly: true,
  // Cross-site production cookies require SameSite=None and HTTPS.
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  // Send the refresh token only with authentication requests.
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function setRefreshCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
}

export function clearRefreshCookie(res) {
  res.clearCookie("refreshToken", {
    ...refreshCookieOptions,
    maxAge: 0,
  });
}
