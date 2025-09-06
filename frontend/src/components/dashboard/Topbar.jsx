import React from "react";

export default function Topbar() {
  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  const onKeyToggle = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <header className="ds-topbar">
      <div className="ds-topbar-left">
        <button
          className="ds-hamburger"
          aria-label="Toggle sidebar"
          onClick={handleToggle}
          onKeyDown={onKeyToggle}
          type="button"
        >
          <i className="fa-solid fa-bars" aria-hidden="true" />
        </button>
        <div className="ds-breadcrumb">› Projects › New Project</div>
      </div>

      <div className="ds-topbar-right">
        <div className="search-wrap">
          <input className="search-input" placeholder="Search" />
        </div>

        <button className="icon-btn" title="Notifications">
          <i className="fa-solid fa-bell" />
        </button>
        <button className="icon-btn" title="Settings">
          <i className="fa-solid fa-gear" />
        </button>
      </div>
    </header>
  );
}
