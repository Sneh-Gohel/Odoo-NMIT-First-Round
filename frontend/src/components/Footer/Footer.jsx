import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h3 className="logo__gradient mb-2">SynergySphere</h3>
            <p className="footer-tagline">Achieve More in One Advanced Team Platform</p>
          </div>
          
          {/* Quick Links Section */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 footer-heading">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/solution" className="text-decoration-none footer-link">Solution</Link></li>
              <li className="mb-2"><Link to="/work" className="text-decoration-none footer-link">WORK</Link></li>
              <li className="mb-2"><Link to="/about" className="text-decoration-none footer-link">About Us</Link></li>
            </ul>
          </div>
          
          {/* Company Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 footer-heading">Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/careers" className="text-decoration-none footer-link">Careers</Link></li>
              <li className="mb-2"><Link to="/bigs" className="text-decoration-none footer-link">BIGS</Link></li>
              <li className="mb-2"><Link to="/press" className="text-decoration-none footer-link">Press</Link></li>
              <li className="mb-2"><Link to="/jobs" className="text-decoration-none footer-link">Jobs</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-decoration-none footer-link">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Connect Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 footer-heading">Connect With Us</h5>
            <div className="d-flex gap-3 mb-4">
              <a href="#" className="text-decoration-none social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none social-icon" aria-label="Twitter">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in fa-lg"></i>
              </a>
              <a href="#" className="text-decoration-none social-icon" aria-label="Instagram">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </div>
            <div className="mt-3">
              <div className="input-group mb-2">
                <input 
                  type="email" 
                  className="form-control newsletter-input" 
                  placeholder="Your email address" 
                  aria-label="Email"
                />
              </div>
              <button className="btn btn-primary w-100 rounded newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
        
        <hr className="my-4 footer-divider" />
        
        <div className="text-center">
          <p className="footer-copyright">© {new Date().getFullYear()} SynergySphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;