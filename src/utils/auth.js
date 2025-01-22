import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";

const allowedOrigins = [
  "https://personal-finance-app-nu.vercel.app",
  "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
];

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>
    err ? null : decoded
  );

const setCorsHeaders = (response, origin) => {
  if (!allowedOrigins.includes(origin)) {
    response.statusCode = 403;
    response.body = JSON.stringify({
      error: "CORS policy: Origin not allowed",
    });
    return response;
  }

  response.headers = {
    ...response.headers,
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return response;
};

export const handler = async (event) => {
  const origin = event.headers.origin || "";
  const headers = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "Preflight Check Passed" };
  }

  await connectToDatabase();

  try {
    const body = JSON.parse(event.body || "{}");

    if (event.path.endsWith("/auth/signup")) {
      const { username, email, password } = body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return setCorsHeaders(
          {
            statusCode: 400,
            body: JSON.stringify({ error: "User already exists" }),
          },
          origin
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await new User({
        username,
        email,
        password: hashedPassword,
      }).save();

      return setCorsHeaders(
        {
          statusCode: 201,
          body: JSON.stringify({
            message: "User created",
            token: generateToken(newUser),
            refreshToken: generateRefreshToken(newUser),
          }),
        },
        origin
      );
    }

    if (event.path.endsWith("/auth/login")) {
      const { email, password } = body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return setCorsHeaders(
          {
            statusCode: 401,
            body: JSON.stringify({ error: "Invalid credentials" }),
          },
          origin
        );
      }

      return setCorsHeaders(
        {
          statusCode: 200,
          body: JSON.stringify({
            message: "Login successful",
            token: generateToken(user),
            refreshToken: generateRefreshToken(user),
          }),
        },
        origin
      );
    }

    if (event.path.endsWith("/auth/verify")) {
      const { token } = body;
      const decoded = verifyToken(token);

      if (!decoded) {
        return setCorsHeaders(
          {
            statusCode: 401,
            body: JSON.stringify({ error: "Token invalid/expired" }),
          },
          origin
        );
      }

      return setCorsHeaders(
        {
          statusCode: 200,
          body: JSON.stringify({ message: "Token valid", decoded }),
        },
        origin
      );
    }

    if (event.path.endsWith("/auth/refresh")) {
      const { refreshToken } = body;

      if (!refreshToken) {
        return setCorsHeaders(
          {
            statusCode: 400,
            body: JSON.stringify({ error: "Refresh token required" }),
          },
          origin
        );
      }

      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
          return setCorsHeaders(
            {
              statusCode: 403,
              body: JSON.stringify({ error: "Invalid refresh token" }),
            },
            origin
          );
        }

        const newAccessToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        return setCorsHeaders(
          {
            statusCode: 200,
            body: JSON.stringify({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            }),
          },
          origin
        );
      } catch {
        return setCorsHeaders(
          {
            statusCode: 403,
            body: JSON.stringify({ error: "Invalid or expired refresh token" }),
          },
          origin
        );
      }
    }

    return setCorsHeaders(
      {
        statusCode: 404,
        body: JSON.stringify({ error: "Route not found" }),
      },
      origin
    );
  } catch (error) {
    console.error("Error handling request:", error);

    return setCorsHeaders(
      {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      },
      origin
    );
  }
};
