import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://192.168.137.3:3333/v1/auth/login";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);

  const validate = () => {
    if (!email.trim()) {
      setServerError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setServerError("Enter a valid email address.");
      return false;
    }
    if (!password) {
      setServerError("Password is required.");
      return false;
    }
    setServerError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerResponse(null);

    if (!validate()) return;

    const payload = { email: email.trim(), password };
    setSubmittedPayload(payload);
    console.log("Login payload:", payload);

    setIsLoading(true);
    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      // Log/Show server response for debugging
      setServerResponse(res.data);
      console.log("Login response:", res.data);

      // Expect response like: { message: "Login successful!", token: "..." }
      if (res.status >= 200 && res.status < 300 && res.data?.token) {
        // Save token (consider secure alternatives for production)
        localStorage.setItem("jwtToken", res.data.token);

        // Optional: store user info if returned (res.data.user)
        if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect to dashboard/home
        navigate("/home");
      } else {
        setServerError(res.data?.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // server returned non-2xx
        setServerError(err.response.data?.message || `Server error ${err.response.status}`);
      } else if (err.request) {
        // request made but no response
        setServerError("No response from server. Is the backend running on localhost:3333?");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-2">Welcome Back</h2>
          <p className="text-center text-muted mb-4">
            Sign in to track your placement journey and unlock
            <br />
            new opportunities
          </p>

          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-control py-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                id="password"
                type="password"
                className="form-control py-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up here</Link>
          </p>

          {/* DEBUG: Last submitted payload and server response (remove in production) */}
          {submittedPayload && (
            <div className="mt-3">
              <h6 className="mb-1">Last submitted payload:</h6>
              <pre className="p-2 bg-light border rounded" style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(submittedPayload, null, 2)}
              </pre>
            </div>
          )}
          {serverResponse && (
            <div className="mt-2">
              <h6 className="mb-1">Server response:</h6>
              <pre className="p-2 bg-light border rounded" style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(serverResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
