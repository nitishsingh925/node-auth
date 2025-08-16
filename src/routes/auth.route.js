import { Router } from "express";
import {
  refreshAccessToken,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import { validation } from "../middlewares/validation-middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  signinValidator,
  signupValidator,
} from "../validation/auth.validation.js";
import Response from "../utils/response.js";

const router = Router();

router.post("/signup", validation(signupValidator), signup);
router.post("/signin", validation(signinValidator), signin);

// public route (no auth)
router.get("/public", (_, res) => {
  return Response.success(res, null, "Public route access granted");
});

// protected route (auth required)
router.get("/protected", verifyToken, (req, res) => {
  // req.user set by verifyToken
  return Response.success(
    res,
    { user: req.user },
    "Protected route access granted"
  );
});
export default router;
