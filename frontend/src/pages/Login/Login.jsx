import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';
import Footer from '../../components/Footer/Footer';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login submission here
    console.log('Login submitted:', formData);
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
                  <h2 className="logo__gradient mb-2">Welcome back – your team is waiting.</h2>
                  <p className="login-subtitle">Login to your SynergySphere account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control login-input"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                      type="password"
                      className="form-control login-input"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot-password">
                      Forgot password?
                    </Link>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 login-btn">
                    Login
                  </button>

                  <div className="text-center mt-4">
                    <p className="signup-redirect">
                      Don't have an account? <Link to="/signup" className="signup-link">Create an account</Link>
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