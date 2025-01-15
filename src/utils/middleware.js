import jwt from "jsonwebtoken";
import User from "../../models/models.js";

export const authenticateToken = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // Extract token from the header
  console.log("Token in authenticate:", token);

  if (!token) {
    if (req.user?.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user && user.refreshToken) {
          token = user.refreshToken; // Use refreshToken if the access token is not provided
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
    // Here we use the same process as in login to verify the token
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
