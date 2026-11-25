import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usernameOrEmail.trim() || !password.trim()) {
      setError("Please enter both username/email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(usernameOrEmail.trim(), password);
      
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (userType) => {
    if (userType === "admin") {
      setUsernameOrEmail("admin");
      setPassword("admin123");
    } else {
      setUsernameOrEmail("user");
      setPassword("user123");
    }
    setError("");
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* HEADER BRANDING */}
        <div className="login-header">
          <div className="login-crest">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h1 className="login-title">Student Management System</h1>
          <p className="login-subtitle">University Academic Portal &amp; Administrative Gateway</p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="login-error-alert" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* USERNAME / EMAIL */}
          <div className="login-field-group">
            <label htmlFor="usernameOrEmail" className="login-label">Username or Email</label>
            <div className="login-input-wrapper">
              <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="usernameOrEmail"
                type="text"
                className="login-input"
                placeholder="Enter username or email address"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="login-field-group">
            <label htmlFor="password" className="login-label">Password</label>
            <div className="login-input-wrapper">
              <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-spinner-layout">
                <span className="spinner"></span> Authenticating...
              </span>
            ) : (
              <span>Sign In to Portal &rarr;</span>
            )}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="login-quick-accounts">
            <span className="quick-accounts-title">Quick Demo Login:</span>
            <div className="quick-buttons">
              <button
                type="button"
                className="quick-chip chip-admin"
                onClick={() => fillQuickCredentials("admin")}
                title="Click to load default ADMIN credentials"
              >
                <strong>ADMIN</strong> (admin / admin123)
              </button>
              <button
                type="button"
                className="quick-chip chip-user"
                onClick={() => fillQuickCredentials("user")}
                title="Click to load default USER credentials"
              >
                <strong>USER</strong> (user / user123)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
