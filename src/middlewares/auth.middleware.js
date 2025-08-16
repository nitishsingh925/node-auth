import jwt from "jsonwebtoken";
import Response from "../utils/response.js";
import { refreshAccessToken } from "../controllers/auth.controller.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export default function verifyToken(req, res, next) {
  console.log("Verifying token...", req);
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) {
      return refreshAccessToken(req, res, next);
    }

    try {
      // Verify access token
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
    } catch (err) {
      return Response.error(res, "Token expired  token", 401);
    }
  } catch (err) {
    return Response.error(res, "Authentication failed", 401);
  }
}
