import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import { validation } from "../middlewares/validation-middleware.js";
import {
  signinValidator,
  signupValidator,
} from "../validation/auth.validation.js";

const router = Router();

router.post("/signup", validation(signupValidator), signup);
router.post("/signin", validation(signinValidator), signin);
export default router;
