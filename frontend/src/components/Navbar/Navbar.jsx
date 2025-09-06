import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";

const THEME_KEY = "synergy-theme";
const TOKEN_KEY = "jwtToken";

const Navbar = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  // listen both storage (other tabs) and authChanged (same tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || e.key === TOKEN_KEY) {
        setToken(localStorage.getItem(TOKEN_KEY));
      }
    };
    const onAuthChanged = () => {
      setToken(localStorage.getItem(TOKEN_KEY));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  // apply theme class to <html>
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

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const cleanupBootstrapUI = () => {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => menu.classList.remove("show"));

    const navbarCollapse = document.querySelector(".navbar-collapse.show");
    if (navbarCollapse) {
      navbarCollapse.classList.remove("show");
      const toggler = document.querySelector(".navbar-toggler");
      if (toggler) toggler.setAttribute("aria-expanded", "false");
    }

    document.querySelectorAll(".modal-backdrop, .offcanvas-backdrop").forEach((b) => {
      if (b.parentNode) b.parentNode.removeChild(b);
    });

    document.body.classList.remove("modal-open");
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    // update local state
    setToken(null);
    // notify other listeners (same tab)
    window.dispatchEvent(new Event("authChanged"));
    // ensure no leftover UI blocks
    cleanupBootstrapUI();
    // navigate to login
    navigate("/login", { replace: true });
  };

  const handleNavigate = (to) => {
    cleanupBootstrapUI();
    navigate(to);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg py-3 navbar-theme">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <h5 className="m-auto nav__logo">
              Synergy<span className="logo__gradient">Sphere</span>
            </h5>
          </Link>

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
                <Link className="nav-link" to="/home" onClick={() => cleanupBootstrapUI()}>
                  Home
                </Link>
              </li>
              <li className="nav-item m-auto">
                <Link className="nav-link" to="/home" onClick={() => cleanupBootstrapUI()}>
                  Solution
                </Link>
              </li>
              <li className="nav-item m-auto">
                <Link className="nav-link" to="/home" onClick={() => cleanupBootstrapUI()}>
                  Work
                </Link>
              </li>
              <li className="nav-item m-auto">
                <Link className="nav-link" to="/home" onClick={() => cleanupBootstrapUI()}>
                  About
                </Link>
              </li>

              <li className="nav-item m-auto">
                <button className="btn theme-toggle btn-sm me-2" onClick={toggleTheme} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                  {theme === "dark" ? <i className="fas fa-sun" /> : <i className="fas fa-moon" />}
                </button>
              </li>

              <li className="nav-item dropdown m-auto">
                {token ? (
                  <>
                    <button className="btn btn-theme btn-sm ms-3 rounded-pill p-2 px-3 dropdown-toggle" id="authDropdown" data-bs-toggle="dropdown" aria-expanded="false" type="button">
                      Workspace
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
                      <li>
                        <button type="button" className="dropdown-item" onClick={() => handleNavigate("/dashboard")}>
                          Go to Workspace
                        </button>
                      </li>
                      <li>
                        <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <Link className="btn btn-theme btn-sm ms-3 rounded-pill p-2 px-3" to="/login" onClick={cleanupBootstrapUI}>
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
