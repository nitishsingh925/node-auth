import Response from "../utils/response.js";
import { signupService, signinService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";

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

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: userinfo._id },
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
      { expiresIn: "7d" }
    );

    // Set both tokens as httpOnly cookies
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // maxAge: 1000 * 60 * 15, // 15 minutes
      maxAge: 1000 * 15, // 15 seconds
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

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

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return Response.error(res, "Refresh token required", 401);
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret"
    );

    const newAccessToken = jwt.sign(
      { id: payload.id, username: payload.username },
      process.env.JWT_SECRET || "change_this_secret",
      { expiresIn: "15s" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1000 * 15,
    });

    return Response.success(
      res,
      { accessToken: newAccessToken },
      "Access token refreshed",
      200
    );
  } catch (error) {
    return Response.error(res, "Invalid or expired refresh token", 401);
  }
};
