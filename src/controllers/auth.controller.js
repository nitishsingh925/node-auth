import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Response from "../utils/response.js";
import { setAuthCookies } from "../utils/cookie.js";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../utils/constants.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Validate fields
    if ([email, username, password].some((field) => field?.trim() === "")) {
      return Response.error(res, "All fields are required", 400);
    }

    // Check if user exists
    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
      return Response.error(res, "User already exists", 409);
    }

    // Create new user
    const newUser = new User({ email, username, password });
    await newUser.save();

    return Response.success(res, newUser, "User Registered Successfully", 201);
  } catch (error) {
    return Response.error(res, "Internal Server Error", 500);
  }
};

export const signin = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if (!(username || email)) {
      return Response.error(res, "Email or Username is required", 400);
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return Response.error(res, "User does not exist", 404);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return Response.error(res, "Invalid user credentials", 401);
    }

    const { password: userPassword, ...userinfo } = user._doc;

    // Generate access token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    return Response.success(res, { userinfo }, "Signin successful", 200);
  } catch (error) {
    return Response.error(res, "Internal Server Error", 500);
  }
};

export const logout = (_, res) => {
  setAuthCookies(res); // no tokens → clears cookies
  return Response.success(res, null, "Logged out successfully", 200);
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return Response.error(res, "Authentication failed", 401);
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign({ id: payload.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const newRefreshToken = jwt.sign({ id: payload.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Set cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

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
