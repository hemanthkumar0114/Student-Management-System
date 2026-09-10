import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudents, getStudentStats } from "../services/studentService";
import { getCourses } from "../services/courseService";
import { useAuth } from "../context/AuthContext";

function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, averageCgpa: 0, activeDepartments: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, coursesData, statsData] = await Promise.all([
          getStudents(),
          getCourses(),
          getStudentStats().catch(() => null)
        ]);

        setRecentStudents(studentsData.slice(0, 5));
        setCourses(coursesData.slice(0, 6));

        if (statsData) {
          setStats(statsData);
        } else {
          const total = studentsData.length;
          const avg = total > 0 ? (studentsData.reduce((acc, s) => acc + (s.cgpa || 0), 0) / total).toFixed(2) : 0;
          const depts = new Set(coursesData.map(c => c.department)).size;
          setStats({ totalStudents: total, averageCgpa: avg, activeDepartments: depts });
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard portal data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ucms-container">
      {/* USER WELCOME HERO */}
      <div className="user-hero-card">
        <div className="user-hero-text">
          <span className="user-role-badge">Student &amp; Faculty Portal</span>
          <h1 className="user-hero-title">Welcome back, {user?.username}!</h1>
          <p className="user-hero-sub">
            Logged in as <strong>{user?.email}</strong> &bull; Access academic directory, course offerings, and campus metrics.
          </p>
        </div>
        <div className="user-status-pill">
          <span className="status-dot-active"></span> Account Status: Active (USER)
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-4 mb-4">
          <strong>Error loading portal:</strong> {error}
        </div>
      )}

      {/* METRICS ROW */}
      <div className="metrics-grid mt-6">
        <div className="metric-card">
          <div className="metric-icon icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Enrolled Students</span>
            <span className="metric-value">{stats.totalStudents}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Average Campus CGPA</span>
            <span className="metric-value">{stats.averageCgpa}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Courses</span>
            <span className="metric-value">{courses.length}</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTIONS */}
      <div className="user-dashboard-grid mt-6">
        {/* RECENT STUDENTS REPOSITORY */}
        <div className="ucms-card">
          <div className="ucms-card-header flex justify-between items-center">
            <div>
              <h2 className="ucms-card-title">Student Directory Snapshot</h2>
              <p className="ucms-card-subtitle">Recent registered student profiles</p>
            </div>
            <Link to="/students" className="btn btn-outline btn-sm">
              View Full Directory &rarr;
            </Link>
          </div>

          <div className="ucms-card-body p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading student registry...</div>
            ) : recentStudents.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No student records found.</div>
            ) : (
              <table className="ucms-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>CGPA</th>
                    <th>Course</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <Link to={`/students/${s.id}`} className="font-semibold text-blue-700 hover:underline">
                          {s.name}
                        </Link>
                      </td>
                      <td className="text-slate-600">{s.email}</td>
                      <td>
                        <span className="badge badge-blue">{s.cgpa}</span>
                      </td>
                      <td className="text-slate-700">{s.courseName || s.course?.courseName || "Unassigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* FEATURED COURSE OFFERINGS */}
        <div className="ucms-card">
          <div className="ucms-card-header flex justify-between items-center">
            <div>
              <h2 className="ucms-card-title">Curriculum Catalog</h2>
              <p className="ucms-card-subtitle">Available degree &amp; certification programs</p>
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">
              Browse All Courses &rarr;
            </Link>
          </div>

          <div className="ucms-card-body p-4">
            {loading ? (
              <div className="text-center text-slate-500 py-4">Loading curriculum catalog...</div>
            ) : (
              <div className="user-courses-list">
                {courses.map((c) => (
                  <div key={c.id} className="user-course-item">
                    <div>
                      <h4 className="font-semibold text-slate-800">{c.courseName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.department} &bull; {c.duration}</p>
                    </div>
                    <Link to={`/courses/${c.id}`} className="btn btn-xs btn-outline">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
