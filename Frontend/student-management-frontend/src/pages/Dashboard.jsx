import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudents, getStudentStats } from "../services/studentService";
import { getCourses } from "../services/courseService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    averageCgpa: 0,
    honorsStudents: 0,
    studentsPerCourse: {},
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsData, coursesData, statsData] = await Promise.all([
        getStudents("").catch(() => []),
        getCourses().catch(() => []),
        getStudentStats().catch(() => null),
      ]);

      const studentList = Array.isArray(studentsData) ? studentsData : (studentsData.content || []);
      setRecentStudents(studentList.slice(0, 5));
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      if (statsData) {
        setStats(statsData);
      } else {
        const totalS = studentList.length;
        const totalC = Array.isArray(coursesData) ? coursesData.length : 0;
        const totalGpa = studentList.reduce((acc, s) => acc + (s.cgpa || 0), 0);
        const avg = totalS > 0 ? (totalGpa / totalS).toFixed(2) : "0.00";
        const honors = studentList.filter((s) => (s.cgpa || 0) >= 8.5).length;
        
        const perCourse = {};
        studentList.forEach((s) => {
          const cName = s.courseName || (s.course && s.course.courseName) || "Unassigned";
          perCourse[cName] = (perCourse[cName] || 0) + 1;
        });

        setStats({
          totalStudents: totalS,
          totalCourses: totalC,
          averageCgpa: parseFloat(avg),
          honorsStudents: honors,
          studentsPerCourse: perCourse,
        });
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError("Failed to load dashboard data. Please make sure the Spring Boot backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ucms-container">
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
          <p>Loading University Campus Management Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ucms-container">
      {/* INSTITUTIONAL BANNER */}
      <section className="ucms-hero-banner">
        <div className="banner-content">
          <div className="banner-badge">Academic Year 2025 – 2026</div>
          <h1 className="banner-title">University Campus Management System (UCMS)</h1>
          <p className="banner-subtitle">
            Centralized Academic Information System & Student Records Management Portal
          </p>
        </div>
        <div className="banner-quick-actions">
          <Link to="/students/add" className="btn btn-primary">
            + Enroll Student
          </Link>
          <Link to="/courses/add" className="btn btn-outline-white">
            + New Course
          </Link>
        </div>
      </section>

      {error && (
        <div className="alert-box alert-error">
          <div className="alert-icon">⚠️</div>
          <div>
            <h4>Backend Connection Alert</h4>
            <p>{error}</p>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={loadDashboardData}>
            Retry
          </button>
        </div>
      )}

      {/* KEY ACADEMIC METRICS CARDS */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box bg-blue-light">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Enrolled Students</span>
            <div className="metric-value">{stats.totalStudents}</div>
            <Link to="/students" className="metric-link">
              View Directory →
            </Link>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-emerald-light">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Academic Courses</span>
            <div className="metric-value">{stats.totalCourses}</div>
            <Link to="/courses" className="metric-link">
              View Courses →
            </Link>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-amber-light">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Campus Average CGPA</span>
            <div className="metric-value">
              {stats.averageCgpa ? stats.averageCgpa.toFixed(2) : "0.00"}
              <span className="metric-scale"> / 10.0</span>
            </div>
            <span className="metric-note">10.0 Grading Standard</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box bg-purple-light">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Dean's List / Honors</span>
            <div className="metric-value">{stats.honorsStudents}</div>
            <span className="metric-note">CGPA &ge; 8.5 / 10.0</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD CONTENT COLUMNS */}
      <div className="ucms-dashboard-grid">
        {/* LEFT COLUMN: RECENT ENROLMENTS */}
        <section className="ucms-card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-title">Recent Student Enrolments</h2>
              <p className="card-subtitle">Latest additions to the university student registry</p>
            </div>
            <Link to="/students" className="btn btn-secondary btn-sm">
              All Students ({stats.totalStudents})
            </Link>
          </div>

          {recentStudents.length === 0 ? (
            <div className="empty-state">
              <p>No student records found in database.</p>
              <Link to="/students/add" className="btn btn-primary btn-sm">
                + Register First Student
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="ucms-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>CGPA (/10)</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="font-mono text-slate-500">#{student.id}</td>
                      <td>
                        <div className="student-cell-name">
                          <span className="font-semibold">{student.name}</span>
                          <span className="text-xs text-slate-500">{student.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-course">
                          {student.courseName || (student.course && student.course.courseName) || "General"}
                        </span>
                      </td>
                      <td>
                        <span className={`cgpa-badge ${student.cgpa >= 8.5 ? "cgpa-high" : student.cgpa >= 7.0 ? "cgpa-mid" : "cgpa-pass"}`}>
                          {student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa).toFixed(2) : "N/A"}
                        </span>
                      </td>
                      <td className="text-slate-600">
                        {student.city ? `${student.city}, ${student.state || ""}` : "Not Specified"}
                      </td>
                      <td>
                        <Link to={`/students/${student.id}`} className="btn-link">
                          Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: QUICK SHORTCUTS & COURSE DISTRIBUTION */}
        <div className="space-y-6">
          {/* QUICK LINKS */}
          <section className="ucms-card">
            <h3 className="card-title-sm">Academic Portals & Actions</h3>
            <div className="quick-links-grid">
              <Link to="/students" className="quick-action-btn">
                <span className="qa-icon">👥</span>
                <div>
                  <strong>Students Directory</strong>
                  <p>Browse, search, edit records</p>
                </div>
              </Link>
              <Link to="/students/add" className="quick-action-btn">
                <span className="qa-icon">📝</span>
                <div>
                  <strong>Register Student</strong>
                  <p>New admission entry</p>
                </div>
              </Link>
              <Link to="/courses" className="quick-action-btn">
                <span className="qa-icon">📚</span>
                <div>
                  <strong>Course Catalog</strong>
                  <p>Departments and programs</p>
                </div>
              </Link>
              <Link to="/courses/add" className="quick-action-btn">
                <span className="qa-icon">➕</span>
                <div>
                  <strong>Add New Course</strong>
                  <p>Register academic degree</p>
                </div>
              </Link>
            </div>
          </section>

          {/* COURSE DISTRIBUTION */}
          <section className="ucms-card">
            <div className="card-header-flex">
              <h3 className="card-title-sm">Programs & Courses</h3>
              <Link to="/courses" className="text-xs text-blue-700 hover:underline">
                Manage ({courses.length})
              </Link>
            </div>
            {courses.length === 0 ? (
              <p className="text-sm text-slate-500">No courses defined yet.</p>
            ) : (
              <ul className="course-breakdown-list">
                {courses.map((course) => {
                  const count = stats.studentsPerCourse && stats.studentsPerCourse[course.courseName]
                    ? stats.studentsPerCourse[course.courseName]
                    : 0;
                  return (
                    <li key={course.id} className="course-breakdown-item">
                      <div>
                        <div className="font-medium text-slate-800">{course.courseName}</div>
                        <div className="text-xs text-slate-500">{course.duration}</div>
                      </div>
                      <span className="badge badge-neutral">{count} Students</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;