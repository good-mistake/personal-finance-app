import jwt from "jsonwebtoken";
import User from "../../models/models";

export const authenticateToken = async (req, res, next) => {
  let token =
    req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (token !== user.refreshToken) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    req.user = user;

    if (token === user.refreshToken) {
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.locals.newAccessToken = newAccessToken;
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Token has expired, please log in again." });
    }
    return res.status(403).json({ message: "Invalid token, access denied." });
  }
};
