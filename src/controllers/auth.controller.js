import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { signupService, signinService } from "../services/auth.service.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const newUser = await signupService(email, username, password);
    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User Registered Successfully"));
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json(new ApiResponse(409, null, error.message));
    }
    if (error.message === "All fields are required") {
      return res.status(400).json(new ApiResponse(400, null, error.message));
    }
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
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
    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(200, { userinfo }));
  } catch (error) {
    let status = 500;
    if (error.message === "Email or Username is required") status = 400;
    if (error.message === "User does not exist") status = 404;
    if (error.message === "Invalid user credentials") status = 401;
    return res
      .status(status)
      .json(
        new ApiResponse(
          status,
          null,
          error.message || "Internal Server Error",
          false
        )
      );
  }
};
