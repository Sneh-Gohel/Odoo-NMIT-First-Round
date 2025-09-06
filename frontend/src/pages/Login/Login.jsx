import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Login.css";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

const API_URL = "http://192.168.137.3:3333/v1/auth/login";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    if (!formData.email.trim()) {
      setServerError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setServerError("Enter a valid email address.");
      return false;
    }
    if (!formData.password) {
      setServerError("Password is required.");
      return false;
    }
    setServerError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    const payload = {
      email: formData.email.trim(),
      password: formData.password,
    };

    setIsLoading(true);
    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      // Expecting { message, token }
      if (res.status >= 200 && res.status < 300 && res.data?.token) {
        localStorage.setItem("jwtToken", res.data.token);

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // notify same-tab listeners that auth changed
        // (App listens to 'authChanged' to update its token state)
        window.dispatchEvent(new Event("authChanged"));

        navigate("/home");
      } else {
        setServerError(
          res.data?.message || "Login failed. Please check credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setServerError(
          err.response.data?.message || `Server error ${err.response.status}`
        );
      } else if (err.request) {
        setServerError("No response from server. Is the backend running?");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="login-card">
                <div className="login-header text-center mb-4">
                  <h2 className="logo__gradient mb-2">
                    Welcome back – your team is waiting.
                  </h2>
                  <p className="login-subtitle">
                    Login to your SynergySphere account
                  </p>
                </div>

                {serverError && (
                  <div className="alert alert-danger" role="alert">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control login-input"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      className="form-control login-input"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="mb-3 form-check d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        disabled={isLoading}
                      />
                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>

                    <Link to="/forgot-password" className="forgot-password">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 login-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing In...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="signup-redirect">
                      Don't have an account?{" "}
                      <Link to="/signup" className="signup-link">
                        Create an account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
