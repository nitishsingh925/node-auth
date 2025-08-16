import Response from "../utils/response.js";
import { signupService, signinService } from "../services/auth.service.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const newUser = await signupService(email, username, password);
    return Response.success(res, newUser, "User Registered Successfully", 201);
  } catch (error) {
    if (error.message === "User already exists") {
      return Response.error(res, error.message, 409);
    }
    if (error.message === "All fields are required") {
      return Response.error(res, error.message, 400);
    }
    return Response.error(res, "Internal Server Error", 500);
  }
};

export const signin = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const { userinfo, token } = await signinService({
      email,
      username,
      password,
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.cookie("accessToken", token, options);
    return Response.success(res, { userinfo }, "Signin successful", 200);
  } catch (error) {
    let status = 500;
    if (error.message === "Email or Username is required") status = 400;
    if (error.message === "User does not exist") status = 404;
    if (error.message === "Invalid user credentials") status = 401;
    return Response.error(
      res,
      error.message || "Internal Server Error",
      status
    );
  }
};
