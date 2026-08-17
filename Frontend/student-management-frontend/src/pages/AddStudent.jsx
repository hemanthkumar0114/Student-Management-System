import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addStudent } from "../services/studentService";
import { getCourses } from "../services/courseService";

function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    cgpa: "8.50",
    courseid: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      setError("");
      const data = await getCourses();
      const courseList = Array.isArray(data) ? data : [];
      setCourses(courseList);
      if (courseList.length > 0) {
        setStudent((prev) => ({ ...prev, courseid: String(courseList[0].id) }));
      }
    } catch (err) {
      console.error("Course Loading Error:", err);
      setError("Failed to load academic courses. Please check the backend connection.");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student.name.trim()) {
      setError("Student Name is required.");
      return;
    }
    if (!student.email.trim()) {
      setError("Student Email is required.");
      return;
    }

    const parsedCgpa = parseFloat(student.cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10.0) {
      setError("CGPA must be a valid number between 0.00 and 10.00.");
      return;
    }

    if (!student.courseid) {
      setError("Please select an enrolled academic course.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: student.name.trim(),
        email: student.email.trim(),
        cgpa: parsedCgpa,
        courseid: Number(student.courseid),
        city: student.city.trim() || "Not Specified",
        state: student.state.trim() || "Not Specified",
        pincode: student.pincode.trim() || "000000",
      };

      await addStudent(payload);
      setMessage("Student registered successfully! Redirecting to student directory...");
      setTimeout(() => {
        navigate("/students");
      }, 1200);
    } catch (err) {
      console.error("Add Student Error:", err);
      setError(err.message || "Failed to add student to the university registry.");
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
            <Link to="/">UCMS Home</Link> <span>/</span> <Link to="/students">Student Directory</Link> <span>/</span> <span className="current">New Admission</span>
          </div>
          <h1 className="page-heading">Student Registration Form</h1>
          <p className="page-subheading">
            Enroll a new student into the university academic registry
          </p>
        </div>
        <div>
          <Link to="/students" className="btn btn-secondary">
            ← Back to Directory
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
        {/* SECTION 1: PERSONAL & ACADEMIC INFO */}
        <div className="ucms-card">
          <div className="form-section-header">
            <span className="section-step">1</span>
            <div>
              <h2 className="card-title">Personal & Academic Details</h2>
              <p className="card-subtitle">Primary student profile and academic metrics</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="e.g. Aarav Sharma"
                value={student.name}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                University / Personal Email <span className="required-star">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="e.g. aarav.sharma@campus.edu"
                value={student.email}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cgpa" className="form-label">
                Cumulative GPA (CGPA) <span className="required-star">*</span>
                <span className="label-helper text-xs text-slate-500 font-normal ml-1">(Scale: 0.00 – 10.00)</span>
              </label>
              <input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="0.0"
                max="10.0"
                className="form-control"
                placeholder="e.g. 8.75"
                value={student.cgpa}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseid" className="form-label">
                Enrolled Academic Program / Course <span className="required-star">*</span>
              </label>
              {loadingCourses ? (
                <div className="text-sm text-slate-500 py-2">Loading available courses...</div>
              ) : (
                <select
                  id="courseid"
                  name="courseid"
                  className="form-control"
                  value={student.courseid}
                  onChange={handleChange}
                  disabled={saving}
                  required
                >
                  <option value="">-- Select Degree / Program --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseName} ({course.duration})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: RESIDENTIAL ADDRESS */}
        <div className="ucms-card">
          <div className="form-section-header">
            <span className="section-step">2</span>
            <div>
              <h2 className="card-title">Residential Address</h2>
              <p className="card-subtitle">Permanent or campus contact address</p>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="city" className="form-label">City</label>
              <input
                id="city"
                name="city"
                type="text"
                className="form-control"
                placeholder="e.g. Bengaluru"
                value={student.city}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">State / Province</label>
              <input
                id="state"
                name="state"
                type="text"
                className="form-control"
                placeholder="e.g. Karnataka"
                value={student.state}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode" className="form-label">Postal / Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                className="form-control"
                placeholder="e.g. 560001"
                value={student.pincode}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* FORM ACTION BUTTONS */}
        <div className="form-actions-bar">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving || loadingCourses}>
            {saving ? "Registering Student..." : "Complete Registration"}
          </button>
          <Link to="/students" className="btn btn-secondary btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;