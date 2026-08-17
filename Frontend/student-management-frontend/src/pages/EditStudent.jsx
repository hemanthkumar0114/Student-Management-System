import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getStudentById, updateStudent } from "../services/studentService";
import { getCourses } from "../services/courseService";

function EditStudent() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentData, coursesData] = await Promise.all([
        getStudentById(id),
        getCourses().catch(() => [])
      ]);

      setCourses(Array.isArray(coursesData) ? coursesData : []);

      if (studentData) {
        setStudent({
          name: studentData.name || "",
          email: studentData.email || "",
          cgpa: studentData.cgpa !== undefined && studentData.cgpa !== null ? String(studentData.cgpa) : "8.0",
          courseid: studentData.courseId ? String(studentData.courseId) : (studentData.course ? String(studentData.course.id) : ""),
          city: studentData.city || (studentData.address ? studentData.address.city : "") || "",
          state: studentData.state || (studentData.address ? studentData.address.state : "") || "",
          pincode: studentData.pincode || (studentData.address ? studentData.address.pincode : "") || "",
        });
      }
    } catch (err) {
      console.error("Load Student Error:", err);
      setError("Failed to load student record from the server.");
    } finally {
      setLoading(false);
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
      setError("CGPA must be between 0.00 and 10.00.");
      return;
    }

    if (!student.courseid) {
      setError("Please select an enrolled course.");
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

      await updateStudent(id, payload);
      setMessage("Student information updated successfully! Returning to directory...");
      setTimeout(() => {
        navigate("/students");
      }, 1200);
    } catch (err) {
      console.error("Update Student Error:", err);
      setError(err.message || "Failed to update student records.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ucms-container">
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
          <p>Loading student information...</p>
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
            <Link to="/">UCMS Home</Link> <span>/</span> <Link to="/students">Student Directory</Link> <span>/</span> <span className="current">Edit #{id}</span>
          </div>
          <h1 className="page-heading">Edit Student Profile</h1>
          <p className="page-subheading">
            Update student academic credentials and contact details
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
              <p className="card-subtitle">Student identification, email, and 10.0 CGPA</p>
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
                value={student.name}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
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
                value={student.cgpa}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseid" className="form-label">
                Academic Program / Course <span className="required-star">*</span>
              </label>
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
                value={student.pincode}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* FORM ACTION BUTTONS */}
        <div className="form-actions-bar">
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Student Profile"}
          </button>
          <Link to="/students" className="btn btn-secondary btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;