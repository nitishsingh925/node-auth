import jwt from "jsonwebtoken";
import Response from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export default function verifyToken(req, res, next) {
  try {
    // try cookie first, then Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

    if (!token) {
      return Response.error(res, "Authentication token required", 401);
    }

    const payload = jwt.verify(token, JWT_SECRET);
    // attach user info to request for downstream handlers
    req.user = payload;
    next();
  } catch (err) {
    return Response.error(res, "Invalid or expired token", 401);
  }
}
