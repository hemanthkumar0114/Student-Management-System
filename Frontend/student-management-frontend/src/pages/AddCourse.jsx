import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCourse } from "../services/courseService";

function AddCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    courseName: "",
    duration: "4 Years",
    department: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.courseName.trim()) {
      setError("Course / Degree Name is required.");
      return;
    }
    if (!course.duration.trim()) {
      setError("Duration is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await addCourse({
        courseName: course.courseName.trim(),
        duration: course.duration.trim(),
        department: course.department.trim() || "General Academic Dept",
      });

      setMessage("Course registered successfully! Redirecting to catalog...");
      setTimeout(() => {
        navigate("/courses");
      }, 1200);
    } catch (err) {
      console.error("Add Course Error:", err);
      setError(err.message || "Failed to register new course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ucms-container">
      {/* PAGE HEADER */}
      <div className="page-header-flex">
        <div>
          <div className="breadcrumb">
            <Link to="/">UCMS Home</Link> <span>/</span> <Link to="/courses">Course Catalog</Link> <span>/</span> <span className="current">New Program</span>
          </div>
          <h1 className="page-heading">Add Academic Program</h1>
          <p className="page-subheading">
            Register a new degree program or course into the university curriculum
          </p>
        </div>
        <div>
          <Link to="/courses" className="btn btn-secondary">
            ← Back to Courses
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <span>⚠️ {error}</span>
          <button className="alert-close" onClick={() => setError("")}>&times;</button>
        </div>
      )}

      {message && (
        <div className="alert-box alert-success">
          <span>✓ {message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ucms-form-layout">
        <div className="ucms-card">
          <div className="form-section-header">
            <span className="section-step">1</span>
            <div>
              <h2 className="card-title">Degree / Course Specifications</h2>
              <p className="card-subtitle">Formal nomenclature and standard program duration</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="courseName" className="form-label">
                Course / Program Title <span className="required-star">*</span>
              </label>
              <input
                id="courseName"
                name="courseName"
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science & Engineering (B.Tech)"
                value={course.courseName}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration" className="form-label">
                Program Duration <span className="required-star">*</span>
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                className="form-control"
                placeholder="e.g. 4 Years (8 Semesters)"
                value={course.duration}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                School / Faculty Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-control"
                placeholder="e.g. School of Computing"
                value={course.department}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="form-actions-bar">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? "Registering Course..." : "Register Academic Course"}
          </button>
          <Link to="/courses" className="btn btn-secondary btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;