import jwt from "jsonwebtoken";
import User from "../../models/models.js";

export const authenticateToken = async (req, res, next) => {
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODVhMTI3ZWY2NjRjMGM3NmZiMzMzNSIsImVtYWlsIjoid2FzZDEyM0BnbWFpbC5jb20iLCJpYXQiOjE3MzY5NTk1NTAsImV4cCI6MTczNjk2MzE1MH0.G3M0djHNejTwQVo7D92tlisdfDu7T4cPbvLO1LvqZ2c";
  console.log(token);

  if (!token) {
    if (req.user?.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user && user.refreshToken) {
          token = user.refreshToken;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(401).json({ message: "Authentication failed" });
      }
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Token has expired, please log in again." });
    }
    return res.status(403).json({ message: "Invalid token, access denied." });
  }
};
