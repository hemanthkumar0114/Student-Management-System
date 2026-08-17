import React from "react";

function MetricsBar({ stats, loading }) {
  const totalStudents = stats?.totalStudents ?? 0;
  const departmentCount = stats?.departmentCount ?? 0;
  const averageGpa = typeof stats?.averageGpa === "number" ? stats.averageGpa.toFixed(2) : "0.00";

  return (
    <div className="metrics-grid">
      {/* CARD 1: TOTAL STUDENTS */}
      <div className="metric-card students-metric">
        <div className="metric-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="metric-info">
          <span className="metric-label">Total Students</span>
          <h3 className="metric-value">
            {loading ? <span className="metric-skeleton">--</span> : totalStudents}
          </h3>
          <span className="metric-badge positive">
            <span className="badge-dot"></span> Active Enrollment
          </span>
        </div>
      </div>

      {/* CARD 2: DEPARTMENTS */}
      <div className="metric-card departments-metric">
        <div className="metric-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M8 14h.01"></path>
            <path d="M16 14h.01"></path>
          </svg>
        </div>
        <div className="metric-info">
          <span className="metric-label">Academic Departments</span>
          <h3 className="metric-value">
            {loading ? <span className="metric-skeleton">--</span> : departmentCount}
          </h3>
          <span className="metric-badge neutral">
            <span className="badge-dot"></span> Academic Programs
          </span>
        </div>
      </div>

      {/* CARD 3: AVERAGE GPA */}
      <div className="metric-card gpa-metric">
        <div className="metric-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div className="metric-info">
          <span className="metric-label">Average Class GPA</span>
          <h3 className="metric-value">
            {loading ? <span className="metric-skeleton">--</span> : `${averageGpa} / 4.0`}
          </h3>
          <span className="metric-badge success">
            <span className="badge-dot"></span> Academic Performance
          </span>
        </div>
      </div>
    </div>
  );
}

export default MetricsBar;
