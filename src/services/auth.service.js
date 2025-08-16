import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants.js";

export async function signupService(email, username, password) {
  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new Error("All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new Error("User already exists");
  }

  const newUser = new User({ email, username, password });
  await newUser.save();
  return newUser;
}

export async function signinService({ email, username, password }) {
  if (!(username || email)) {
    throw new Error("Email or Username is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new Error("User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new Error("Invalid user credentials");
  }

  const { password: userPassword, ...userinfo } = user._doc;
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);

  return { userinfo, token };
}
