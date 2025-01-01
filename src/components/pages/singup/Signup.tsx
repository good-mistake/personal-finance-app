import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.scss";
import Buttons from "../../reusable/button/Buttons";
import useMediaQuery from "../../../utils/useMediaQuery";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isTablet = useMediaQuery("tablet");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setLoading(false);
      if (!response.ok) {
        const resError = await response.json();
        setError(resError.message);
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (e) {
      setLoading(false);

      if (e.response) {
        if (e.response.status === 400) {
          setError(
            "User already exists. Please log in or use a different email."
          );
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
    <div className="signUpContainer">
      {isTablet && (
        <div className="tabletLogo">
          <img src="/images/logo-large.svg" alt="Logo" />
        </div>
      )}{" "}
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
          <h1>Sign Up</h1>
          <div>
            <label htmlFor="name">
              <p>Name</p>
              <input
                name="name"
                id="name"
                placeholder="Name"
                onChange={handleChange}
                autoComplete="username"
              />
            </label>
          </div>
          <div>
            <label htmlFor="email">
              <p>Email</p>{" "}
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
            <p> Create Password</p>
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
            disabled={loading}
          >
            {loading ? "Singing up..." : "Sing up"}
          </Buttons>
          <div className="signUpLink">
            Already have an account?
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
          {success ? (
            <div className="success">Sing up Successful! Redirecting...</div>
          ) : (
            <div className="error">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
