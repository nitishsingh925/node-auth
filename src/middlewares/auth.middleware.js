import jwt from "jsonwebtoken";
import Response from "../utils/response.js";
import { refreshAccessToken } from "../controllers/auth.controller.js";
import { ACCESS_TOKEN_SECRET } from "../utils/constants.js";

export default function verifyToken(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) {
      return refreshAccessToken(req, res, next);
    }

    try {
      // Verify access token
      const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
      req.user = payload;
      return next();
    } catch (err) {
      return Response.error(res, "Token expired  token", 401);
    }
  } catch (err) {
    return Response.error(res, "Authentication failed", 401);
  }
}
