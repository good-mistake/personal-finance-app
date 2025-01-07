import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../../redux/userSlice";
import Buttons from "../../reusable/button/Buttons.tsx";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://personal-finance-app-nu.vercel.app/";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      dispatch(
        login({
          name: data.result.name,
          email: data.result.email,
          pots: data.result.pots || [],
          budgets: data.result.budgets || [],
          transactions: data.result.transactions || [],
        })
      );

      navigate("/");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Email not registered. Please sign up.");
        } else if (error.response.status === 400) {
          setError("Incorrect password. Please try again.");
        } else {
          setError(
            error.response.data.message ||
              "An error occurred. Please try again."
          );
        }
      } else {
        setError(error.message || "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <Buttons
          type="submit"
          className={`login ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Buttons>
      </form>
    </div>
  );
};

export default Login;
