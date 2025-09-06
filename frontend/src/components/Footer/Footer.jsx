import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: wire up your subscribe API here
    alert("Thanks — subscription form will be wired to API.");
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row gy-4">
          {/* Brand Section */}
          <div className="col-12 col-md-6 col-lg-4 d-flex flex-column justify-content-center text-center text-md-start">
            <div className="footer-logo">
              <h3 className="logo__gradient mb-1">SynergySphere</h3>
              <p className="footer-tagline mb-0">
                Achieve More in One Advanced Team Platform
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <nav
            className="col-12 col-md-6 col-lg-4"
            aria-label="Footer Quick Links"
          >
            <h5 className="fw-bold mb-3 border-bottom pb-2 footer-heading text-center text-md-start">
              Quick Links
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 align-items-center align-items-md-start mb-0">
              <li>
                <Link to="/home" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/solution" className="footer-link">
                  Solution
                </Link>
              </li>
              <li>
                <Link to="/work" className="footer-link">
                  Work
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="footer-link">
                  Signup
                </Link>
              </li>
            </ul>
          </nav>

          {/* Connect / Newsletter */}
          <div className="col-12 col-md-12 col-lg-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 footer-heading text-center text-md-start">
              Connect With Us
            </h5>

            <div className="d-flex gap-3 justify-content-center justify-content-md-start mb-3">
              <a
                href="#"
                className="social-icon"
                aria-label="Facebook"
                title="Facebook"
              >
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
                <span className="visually-hidden">Facebook</span>
              </a>

              <a
                href="#"
                className="social-icon"
                aria-label="Twitter"
                title="Twitter"
              >
                <i className="fab fa-twitter" aria-hidden="true"></i>
                <span className="visually-hidden">Twitter</span>
              </a>

              <a
                href="#"
                className="social-icon"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                <span className="visually-hidden">LinkedIn</span>
              </a>

              <a
                href="#"
                className="social-icon"
                aria-label="Instagram"
                title="Instagram"
              >
                <i className="fab fa-instagram" aria-hidden="true"></i>
                <span className="visually-hidden">Instagram</span>
              </a>
            </div>

            <form onSubmit={handleSubscribe} className="d-flex flex-column gap-2">
              <label htmlFor="footer-newsletter" className="visually-hidden">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                className="form-control newsletter-input"
                placeholder="Your email address"
                aria-label="Email address"
                required
              />
              <button type="submit" className="newsletter-btn btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="my-4 footer-divider" />

        <div className="text-center">
          <p className="footer-copyright">
            © {new Date().getFullYear()} SynergySphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
