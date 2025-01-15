import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../db.js";
import User from "../../../models/models.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const token =
    req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.refreshToken !== token) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
}
