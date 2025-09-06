import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="ds-layout">
      <Sidebar />
      <div className="ds-main">
        <Topbar />
        <div className="ds-content">{children}</div>
      </div>
    </div>
  );
}
