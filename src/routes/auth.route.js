import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import { validation } from "../middlewares/validation-middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  signinValidator,
  signupValidator,
} from "../validation/auth.validation.js";

const router = Router();

router.post("/signup", validation(signupValidator), signup);
router.post("/signin", validation(signinValidator), signin);

// public route (no auth)
router.get("/public", (req, res) => {
  return res.status(200).json("Public route access granted");
});

// protected route (auth required)
router.get("/protected", verifyToken, (req, res) => {
  // req.user set by verifyToken
  return res.status(200).json("Protected route access granted");
});
export default router;
