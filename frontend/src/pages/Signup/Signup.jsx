import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import "./Signup.css";

/**
 * Signup with OTP verification component.
 *
 * - Initiate signup: POST { name, email, password } -> API_URL_INIT
 * - Verify OTP: POST { email, otp } -> API_URL_VERIFY
 *
 * Adjust API URLs if your server uses different paths.
 */
const API_URL_INIT = "http://192.168.137.3:3333/v1/auth/signup/initiate";
const API_URL_VERIFY = "http://192.168.137.3:3333/v1/auth/signup/verify";

function Signup() {
  const navigate = useNavigate();

  // form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // OTP state
  const [otp, setOtp] = useState("");

  // UI state
  const [step, setStep] = useState("form"); // 'form' | 'verify' | 'done'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Simple validation for the initial signup form
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
    if (infoMessage) setInfoMessage("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (serverError) setServerError("");
    if (infoMessage) setInfoMessage("");
  };

  // trigger resend countdown (simple)
  const startResendCountdown = (seconds = 30) => {
    setResendCountdown(seconds);
    const timer = setInterval(() => {
      setResendCountdown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // Submit initial signup (initiate)
  const submitInitiate = async (e) => {
    if (e) e.preventDefault();
    setServerError("");
    setInfoMessage("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        password: formData.password,
      };

      const res = await axios.post(API_URL_INIT, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      // assume API 2xx = OTP sent / initiated
      if (res.status >= 200 && res.status < 300) {
        setStep("verify");
        setInfoMessage(res.data?.message || "OTP sent to your email. Enter it below to verify.");
        startResendCountdown(30);
      } else {
        setServerError(res.data?.message || "Could not initiate signup. Try again.");
      }
    } catch (err) {
      console.error("Signup initiate error:", err);
      if (err.response) {
        setServerError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setServerError("No response from server. Check network/connectivity.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit OTP verification
  const submitVerify = async (e) => {
    if (e) e.preventDefault();
    setServerError("");
    setInfoMessage("");

    if (!otp.trim()) {
      setServerError("Please enter the OTP sent to your email.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email.trim(),
        otp: otp.trim(),
      };

      const res = await axios.post(API_URL_VERIFY, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      if (res.status >= 200 && res.status < 300) {
        setStep("done");
        setInfoMessage(res.data?.message || "Verification successful. Redirecting to login...");
        // Navigate to login after short delay so user can see message
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setServerError(res.data?.message || "OTP verification failed. Try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      if (err.response) {
        setServerError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setServerError("No response from server. Check network/connectivity.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP (calls initiate again)
  const resendOtp = async () => {
    setServerError("");
    setInfoMessage("");
    if (!formData.email.trim()) {
      setServerError("Email is required to resend OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        password: formData.password,
      };
      const res = await axios.post(API_URL_INIT, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      if (res.status >= 200 && res.status < 300) {
        setInfoMessage(res.data?.message || "OTP resent. Check your inbox.");
        startResendCountdown(30);
      } else {
        setServerError(res.data?.message || "Failed to resend OTP. Try again later.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      if (err.response) {
        setServerError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setServerError("No response from server. Check network/connectivity.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="signup-card">
                <div className="signup-header text-center mb-4">
                  <h2 className="logo__gradient mb-2">Join the sphere of smarter teamwork.</h2>
                  <p className="signup-subtitle">Create your SynergySphere account today</p>
                </div>

                {step === "form" && (
                  <form onSubmit={submitInitiate} className="signup-form" noValidate>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name:</label>
                        <input
                          type="text"
                          className={`form-control signup-input ${errors.firstName ? "is-invalid" : ""}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={isLoading}
                          autoComplete="given-name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                        <input
                          type="text"
                          className={`form-control signup-input ${errors.lastName ? "is-invalid" : ""}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={isLoading}
                          autoComplete="family-name"
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email:</label>
                      <input
                        type="email"
                        className={`form-control signup-input ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        autoComplete="email"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password:</label>
                      <input
                        type="password"
                        className={`form-control signup-input ${errors.password ? "is-invalid" : ""}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms"
                        required
                        disabled={isLoading}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        By creating an account, I agree to maintain a clear workplace
                      </label>
                    </div>

                    {serverError && (
                      <div className="alert alert-danger" role="alert">{serverError}</div>
                    )}
                    {infoMessage && (
                      <div className="alert alert-success" role="alert">{infoMessage}</div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 signup-btn" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending OTP...
                        </>
                      ) : (
                        "Create an account"
                      )}
                    </button>

                    <div className="text-center mt-3">
                      <p className="login-redirect">
                        Already have an account? <Link to="/login" className="login-link">Login</Link>
                      </p>
                    </div>
                  </form>
                )}

                {step === "verify" && (
                  <form onSubmit={submitVerify} className="verify-form" noValidate>
                    <div className="mb-3 text-center">
                      <p className="mb-1">We sent a verification code to</p>
                      <strong>{formData.email}</strong>
                      <p className="small text-muted">Enter the code below to verify your email and complete signup.</p>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="otp" className="form-label">Verification Code</label>
                      <input
                        type="text"
                        className={`form-control signup-input ${serverError ? "is-invalid" : ""}`}
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={isLoading}
                        inputMode="numeric"
                        placeholder="Enter code"
                      />
                      {serverError && <div className="invalid-feedback">{serverError}</div>}
                    </div>

                    {infoMessage && (
                      <div className="alert alert-success" role="alert">{infoMessage}</div>
                    )}

                    <div className="d-flex gap-2 mb-3">
                      <button type="submit" className="btn btn-primary flex-fill" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Verifying...
                          </>
                        ) : (
                          "Verify & Complete Signup"
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={resendOtp}
                        disabled={isLoading || resendCountdown > 0}
                      >
                        {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend OTP"}
                      </button>
                    </div>

                    <div className="text-center mt-2">
                      <p className="login-redirect mb-0">
                        Need to change email? <button className="btn btn-link p-0" onClick={() => setStep("form")}>Edit details</button>
                      </p>
                    </div>
                  </form>
                )}

                {step === "done" && (
                  <div className="text-center">
                    <div className="alert alert-success">
                      {infoMessage || "Signup complete. Redirecting..."}
                    </div>
                    <p>You will be redirected to login shortly.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
