import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export default function verifyToken(req, res, next) {
  try {
    // try cookie first, then Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

    if (!token) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, null, "Authentication token required", false)
        );
    }

    const payload = jwt.verify(token, JWT_SECRET);
    // attach user info to request for downstream handlers
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid or expired token", false));
  }
}
