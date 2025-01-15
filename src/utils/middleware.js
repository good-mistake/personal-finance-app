import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received:", token);

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
