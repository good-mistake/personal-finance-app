import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";

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

const setCorsHeaders = (response) => {
  response.headers = {
    ...response.headers,
    "Access-Control-Allow-Origin": "https://personal-finance-app-nu.vercel.app",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return response;
};

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://personal-finance-app-nu.vercel.app",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "Preflight Check Passed" };
  }

  await connectToDatabase();

  try {
    const body = JSON.parse(event.body);

    if (event.path === "/api/auth/signup") {
      const { username, email, password } = body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return setCorsHeaders({
          statusCode: 400,
          body: JSON.stringify({ error: "User already exists" }),
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await new User({
        username,
        email,
        password: hashedPassword,
      }).save();

      return setCorsHeaders({
        statusCode: 201,
        body: JSON.stringify({
          message: "User created",
          token: generateToken(newUser),
          refreshToken: generateRefreshToken(newUser),
        }),
      });
    }

    if (event.path === "/api/auth/login") {
      const { email, password } = body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return setCorsHeaders({
          statusCode: 401,
          body: JSON.stringify({ error: "Invalid credentials" }),
        });
      }

      return setCorsHeaders({
        statusCode: 200,
        body: JSON.stringify({
          message: "Login successful",
          token: generateToken(user),
          refreshToken: generateRefreshToken(user),
        }),
      });
    }

    if (event.path === "/api/auth/verify") {
      const { token } = body;
      const decoded = verifyToken(token);
      if (!decoded) {
        return setCorsHeaders({
          statusCode: 401,
          body: JSON.stringify({ error: "Token invalid/expired" }),
        });
      }

      return setCorsHeaders({
        statusCode: 200,
        body: JSON.stringify({ message: "Token valid", decoded }),
      });
    }

    return setCorsHeaders({
      statusCode: 404,
      body: JSON.stringify({ error: "Route not found" }),
    });
  } catch (error) {
    return setCorsHeaders({
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    });
  }
};
