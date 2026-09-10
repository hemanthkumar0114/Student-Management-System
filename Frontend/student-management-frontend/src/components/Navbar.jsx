import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuthHeaders } from "../services/authService";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          method: "GET",
          headers: getAuthHeaders()
        });
        if (res.status !== 500 && res.status !== 502 && res.status !== 503) {
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
    if (path === "/" || path === "/dashboard" || path === "/user-dashboard") {
      if (location.pathname === "/" || location.pathname === "/dashboard" || location.pathname === "/user-dashboard") {
        return "nav-item active";
      }
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return "nav-item active";
    }
    return "nav-item";
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const homeTarget = isAdmin ? "/dashboard" : "/user-dashboard";

  return (
    <header className="ucms-navbar">
      <div className="ucms-navbar-inner">
        {/* INSTITUTIONAL BRANDING */}
        <Link to={isAuthenticated ? homeTarget : "/login"} className="navbar-brand">
          <div className="university-crest">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-name">UCMS Student Portal</span>
            <span className="brand-tagline">Academic Information &amp; Management Registry</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS (Only when authenticated) */}
        {isAuthenticated && (
          <nav className="navbar-links">
            <Link to={homeTarget} className={isActive(homeTarget)}>
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

            {isAdmin && (
              <Link to="/students/add" className={isActive("/students/add")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Register Student</span>
              </Link>
            )}

            <Link to="/courses" className={isActive("/courses")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Courses Catalog</span>
            </Link>

            {isAdmin && (
              <Link to="/courses/add" className={isActive("/courses/add")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Course</span>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin/users" className={isActive("/admin/users")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="17" y1="11" x2="23" y2="11"></line>
                </svg>
                <span>Admin Users</span>
              </Link>
            )}
          </nav>
        )}

        {/* RIGHT USER BADGE & LOGOUT / STATUS AREA */}
        <div className="navbar-status-area">
          <div className={`backend-indicator status-${backendStatus}`} title={`Spring Boot Backend: ${backendStatus}`}>
            <span className="dot"></span>
            <span className="label">
              {backendStatus === "online" ? "API Live" : "Offline"}
            </span>
          </div>

          {isAuthenticated && user && (
            <div className="nav-user-pill">
              <span className="user-name">{user.username}</span>
              <span className={`role-badge ${isAdmin ? "role-admin" : "role-user"}`}>
                {user.role}
              </span>
              <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;