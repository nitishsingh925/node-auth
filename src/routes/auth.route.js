import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import { validation } from "../middlewares/validation-middleware.js";
import { signupValidator } from "../validation/signup.validation.js";
import { signinValidator } from "../validation/signin.vailidation.js";

const router = Router();

router.post("/signup", validation(signupValidator), signup);
router.post("/signin", validation(signinValidator), signin);
export default router;
