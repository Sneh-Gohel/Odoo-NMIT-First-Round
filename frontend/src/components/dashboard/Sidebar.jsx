import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  // start not collapsed on desktop; you can change default if you like
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("jwtToken");
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // toggle from Topbar
    const toggleHandler = () => setCollapsed((c) => !c);
    window.addEventListener("toggleSidebar", toggleHandler);

    // keep collapsed state in sync with small screens if you want
    const resizeHandler = () => {
      if (window.innerWidth < 640) setCollapsed(true);
      // optional: expand automatically on big screens:
      // else setCollapsed(false)
    };
    window.addEventListener("resize", resizeHandler);

    // listen to auth changes (other parts of app can dispatch 'authChanged')
    const onAuth = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("authChanged", onAuth);

    return () => {
      window.removeEventListener("toggleSidebar", toggleHandler);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("authChanged", onAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const avatarSrc = () => {
    if (user) {
      if (typeof user.avatar === "string" && user.avatar) return user.avatar;
      if (typeof user.photo === "string" && user.photo) return user.photo;
      if (user.email)
        return `https://i.pravatar.cc/64?u=${encodeURIComponent(user.email)}`;
    }
    return "https://i.pravatar.cc/64";
  };

  return (
    <aside
      className={`ds-sidebar ${collapsed ? "collapsed" : ""}`}
      aria-label="Main sidebar"
    >
      <div className="ds-sidebar-inner">
        {/* Brand */}
        <div className="ds-brand">
          <div className="ds-logo" aria-hidden>
            ◐
          </div>
          {!collapsed && (
            <div className="ds-brand-text">
              <div className="brand-name">SynergySphere</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="ds-nav" aria-label="Primary">
          <NavLink
            to="/dashboard/projects"
            className="ds-nav-link"
            end
            title="Projects"
          >
            <i className="fa-solid fa-layer-group me-2" aria-hidden="true" />
            {!collapsed && "Projects"}
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className="ds-nav-link"
            title="Profile"
          >
            <i className="fa-solid fa-user me-2" aria-hidden="true" />
            {!collapsed && "Profile"}
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className="ds-nav-link"
            title="Settings"
          >
            <i className="fa-solid fa-gear me-2" aria-hidden="true" />
            {!collapsed && "Settings"}
          </NavLink>
        </nav>

        <div className="ds-spacer" />

        {/* User section */}
        <div className="ds-user">
          <div
            className="user-info"
            onClick={() => navigate("/dashboard/profile")}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <img
              className="user-avatar"
              src={avatarSrc()}
              alt={user?.name || "User"}
            />
            {!collapsed && (
              <div className="user-meta">
                <div className="user-name">{user?.name || "Shivam Patel"}</div>
                <div className="user-email">
                  {user?.email || "test123@gmail.com"}
                </div>
              </div>
            )}
          </div>

          <div className="user-actions">
            {token ? (
              <button
                className="btn-logout"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
              >
                <i
                  className="fa-solid fa-right-from-bracket me-1"
                  aria-hidden="true"
                />
                <span className="btn-text">Logout</span>
              </button>
            ) : (
              <button
                className="btn-login"
                onClick={() => navigate("/login")}
                aria-label="Login"
                title="Login"
              >
                <i
                  className="fa-solid fa-right-to-bracket me-1"
                  aria-hidden="true"
                />
                <span className="btn-text">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
