import React, { useState } from "react";
import { login } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./login.scss";
import Buttons from "../../reusable/button/Buttons";
import api from "../../../utils/Interceptor";
import useMediaQuery from "../../../utils/useMediaQuery";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isTablet = useMediaQuery("tablet");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", formData);

      setLoading(false);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      if (data.result) {
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
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setError("User data is not available.");
      }
    } catch (e) {
      setLoading(false);

      if (e.response) {
        if (e.response.status === 404) {
          setError(
            `User not found. Please check your email and password or sign up.`
          );
        } else if (e.response.status === 400) {
          setError("Invalid credentials. Please try again.");
        } else {
          setError(
            e.response.data.message || "An error occurred. Please try again."
          );
        }
      } else {
        setError(e.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="loginContainer">
      {isTablet && (
        <div className="tabletLogo">
          <img src="/images/logo-large.svg" alt="Logo" />
        </div>
      )}
      <div className="left">
        <div>
          <h2>Keep track of your money and save for your future</h2>
          <p>
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
      <div className="right">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div>
            <label htmlFor="email">
              <p> Email</p>
              <input
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                autoComplete="email"
              />
            </label>
          </div>
          <label htmlFor="password">
            <p> Password</p>
            <div className="pass">
              <input
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                autoComplete="new-password"
              />
              <img
                src="/images/icon-show-password.svg"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                alt=""
              />
            </div>
          </label>
          <Buttons
            type="submit"
            className={`login ${loading ? "loading" : ""}`}
            variant="primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Buttons>
          <div className="signUpLink">
            Need to create an account?
            <button onClick={() => navigate("/signup")}>Sign Up </button>
          </div>
          {success ? (
            <div className="success">Login Successful! Redirecting...</div>
          ) : (
            <div className="error">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
