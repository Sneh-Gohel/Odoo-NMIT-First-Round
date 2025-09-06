import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const THEME_KEY = "synergy-theme";

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      // default: use system preference
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg py-3 navbar-theme">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <h5 className="m-auto nav__logo ">
              Synergy<span className="logo__gradient">Sphere</span>
            </h5>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item m-auto">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item m-auto">
                <a className="nav-link" href="#">
                  Solution
                </a>
              </li>
              <li className="nav-item m-auto">
                <a className="nav-link" href="#">
                  Work
                </a>
              </li>
              <li className="nav-item m-auto">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>

              {/* Theme toggle */}
              <li className="nav-item m-auto">
                <button
                  className="btn theme-toggle btn-sm me-2"
                  onClick={toggleTheme}
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    // Sun icon (light mode)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden
                    >
                      <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                      <path d="M8 0a.5.5 0 0 1 .5.5V2a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 8 0zM8 14a.5.5 0 0 1 .5.5V16a.5.5 0 0 1-1 0v-1.5A.5.5 0 0 1 8 14zM0 8a.5.5 0 0 1 .5-.5H2a.5.5 0 0 1 0 1H.5A.5.5 0 0 1 0 8zM14 8a.5.5 0 0 1 .5-.5H16a.5.5 0 0 1 0 1h-1.5A.5.5 0 0 1 14 8zM2.343 2.343a.5.5 0 0 1 .707 0L4 3.293a.5.5 0 1 1-.707.707L2.343 3.05a.5.5 0 0 1 0-.707zM11.293 11.293a.5.5 0 0 1 .707 0l1.293 1.293a.5.5 0 0 1-.707.707L11.293 12a.5.5 0 0 1 0-.707zM11.293 4.707a.5.5 0 0 1 0 .707l-1.293 1.293a.5.5 0 1 1-.707-.707L10.586 4.707a.5.5 0 0 1 .707 0zM4 11.293a.5.5 0 0 1 0 .707L2.707 13.293a.5.5 0 0 1-.707-.707L3.293 11.293a.5.5 0 0 1 .707 0z" />
                    </svg>
                  ) : (
                    // Moon icon (dark mode)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      aria-hidden
                    >
                      <path d="M6 0a6 6 0 0 0 0 12c3.314 0 6-2.686 6-6a6 6 0 0 0-6-6z" />
                    </svg>
                  )}
                </button>
              </li>

              <li className="nav-item m-auto">
                <button
                  className="btn btn-theme btn-sm ms-3 rounded-pill p-2 px-3"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
