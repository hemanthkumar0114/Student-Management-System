import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8080/courses", { method: "GET" });
        if (res.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch (err) {
        setBackendStatus("offline");
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return "nav-item active";
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return "nav-item active";
    }
    return "nav-item";
  };

  return (
    <header className="ucms-navbar">
      <div className="ucms-navbar-inner">
        {/* INSTITUTIONAL BRANDING */}
        <Link to="/" className="navbar-brand">
          <div className="university-crest">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-name">UCMS University Portal</span>
            <span className="brand-tagline">Academic Information & Student Registry</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="navbar-links">
          <Link to="/" className={isActive("/")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link to="/students" className={isActive("/students")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Students Directory</span>
          </Link>

          <Link to="/students/add" className={isActive("/students/add")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Register Student</span>
          </Link>

          <Link to="/courses" className={isActive("/courses")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Courses Catalog</span>
          </Link>

          <Link to="/courses/add" className={isActive("/courses/add")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Course</span>
          </Link>
        </nav>

        {/* RIGHT STATUS INDICATOR */}
        <div className="navbar-status-area">
          <div className={`backend-indicator status-${backendStatus}`} title={`Spring Boot Backend: ${backendStatus}`}>
            <span className="dot"></span>
            <span className="label">
              {backendStatus === "online" ? "API Live (8080)" : backendStatus === "offline" ? "Backend Offline" : "Connecting..."}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;