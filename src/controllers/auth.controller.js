import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Response from "../utils/response.js";
import { setAuthCookies } from "../utils/cookie.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

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
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      {
        expiresIn: "15s",
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Set cookies
    setAuthCookies(res, token, refreshToken);

    return Response.success(res, { userinfo }, "Signin successful", 200);
  } catch (error) {
    return Response.error(res, "Internal Server Error", 500);
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return Response.error(res, "Refresh token required", 401);
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: "15s",
    });

    const newRefreshToken = jwt.sign({ id: payload.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
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
