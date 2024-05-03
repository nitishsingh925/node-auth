import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  // Check if user with the given email or username blank (empty) exists
  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user with the given email or username already exists
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    // If user already exists, return a response without the new user details
    return res
      .status(409)
      .json(new ApiResponse(409, null, "User already exists"));
  }

  try {
    // If user doesn't exist, create a new user
    const newUser = new User({ email, username, password });
    await newUser.save();

    // Return a response with the new user details
    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User Registered Successfully"));
  } catch (error) {
    // Return a response with a generic error message
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const signin = async (req, res) => {
  const { email, username, password } = req.body;

  // Checking if either username or email is provided
  if (!(username || email)) {
    throw new ApiError(400, "Email or Username is required");
  }

  try {
    // Finding user by email or username in the database
    const user = await User.findOne({ $or: [{ email }, { username }] });

    // If user doesn't exist
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    // Checking if the provided password is correct
    // isPasswordCorrect is a method defined in the user model
    const isPasswordValid = await user.isPasswordCorrect(password);

    // If the password is not valid
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    //  remove the password from the user object
    const { password: userPassword, ...userinfo } = user._doc;

    // Generating a JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Return a response with the user details and access token
    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(200, { userinfo }));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          error.statusCode || 500,
          null,
          error.message || "Internal Server Error",
          false
        )
      );
  }
};
