process.loadEnvFile();

// server port
export const PORT = process.env.PORT || 5000;

// MongoDB connection
export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = "node-auth";

// Auth
// JWT
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

// for cookie options
export const COOKIE_OPTIONS = {
  httpOnly: process.env.COOKIE_HTTP_ONLY,
  secure: process.env.COOKIE_SECURE,
  sameSite: process.env.COOKIE_SAME_SITE,
  accessTokenTime: process.env.ACCESS_TOKEN_COOKIE_EXPIRE,
  refreshTokenTime: process.env.REFRESH_TOKEN_COOKIE_EXPIRE,
};
