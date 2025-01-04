import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../db.mjs";
import User from "../../models/models";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight" }),
    };
  }

  await connectToDatabase();

  if (event.httpMethod === "POST" && event.path === "/api/auth/signup") {
    const { username, email, password } = JSON.parse(event.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "User already exists" }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await user.save();
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: "User created successfully",
          token,
          refreshToken,
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Error during signup" }),
      };
    }
  }

  if (event.httpMethod === "POST" && event.path === "/api/auth/login") {
    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Login successful",
        token,
        refreshToken,
      }),
    };
  }

  if (event.httpMethod === "POST" && event.path === "/api/auth/verify") {
    const { token } = JSON.parse(event.body);

    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid or expired token" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Token is valid", decoded }),
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: "Not Found" }),
  };
};
