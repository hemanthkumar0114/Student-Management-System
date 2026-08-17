import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "../services/courseService";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    courseName: "",
    duration: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCourseById(id);
      if (data) {
        setCourse({
          courseName: data.courseName || "",
          duration: data.duration || "",
          department: data.department || "",
        });
      }
    } catch (err) {
      console.error("Load Course Error:", err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

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
      setError("Course Name is required.");
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

      await updateCourse({
        id: Number(id),
        courseName: course.courseName.trim(),
        duration: course.duration.trim(),
        department: course.department.trim(),
      });

      setMessage("Course updated successfully! Returning to catalog...");
      setTimeout(() => {
        navigate("/courses");
      }, 1200);
    } catch (err) {
      console.error("Update Course Error:", err);
      setError(err.message || "Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ucms-container">
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
          <p>Loading course information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ucms-container">
      {/* PAGE HEADER */}
      <div className="page-header-flex">
        <div>
          <div className="breadcrumb">
            <Link to="/">UCMS Home</Link> <span>/</span> <Link to="/courses">Course Catalog</Link> <span>/</span> <span className="current">Edit #{id}</span>
          </div>
          <h1 className="page-heading">Edit Course Details</h1>
          <p className="page-subheading">
            Modify course catalog title, department affiliation, and standard duration
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
              <h2 className="card-title">Course Specifications</h2>
              <p className="card-subtitle">Course ID: #{id}</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="courseName" className="form-label">
                Course Title <span className="required-star">*</span>
              </label>
              <input
                id="courseName"
                name="courseName"
                type="text"
                className="form-control"
                value={course.courseName}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration" className="form-label">
                Duration <span className="required-star">*</span>
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                className="form-control"
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
                value={course.department}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="form-actions-bar">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Course Information"}
          </button>
          <Link to="/courses" className="btn btn-secondary btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditCourse;