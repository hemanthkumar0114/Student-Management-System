import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getStudentById, deleteStudent } from "../services/studentService";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentById(id);
      setStudent(data);
    } catch (err) {
      console.error("Student Details Error:", err);
      setError("Failed to load student profile records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;
    const confirm = window.confirm(`Are you sure you want to permanently delete the student record for "${student.name}"?`);
    if (!confirm) return;

    try {
      await deleteStudent(student.id);
      navigate("/students");
    } catch (err) {
      alert("Failed to delete student: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="ucms-container">
        <div className="loading-spinner-wrapper">
          <div className="spinner"></div>
          <p>Loading student academic record...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="ucms-container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2>Record Not Found</h2>
          <p>{error || "No student record found with the specified identification number."}</p>
          <Link to="/students" className="btn btn-primary btn-sm">
            ← Return to Student Directory
          </Link>
        </div>
      </div>
    );
  }

  const courseTitle = student.courseName || (student.course && student.course.courseName) || "Not Assigned";
  const duration = student.duration || (student.course && student.course.duration) || "4 Years";
  const city = student.city || (student.address && student.address.city) || "Not Specified";
  const state = student.state || (student.address && student.address.state) || "Not Specified";
  const pincode = student.pincode || (student.address && student.address.pincode) || "Not Specified";
  const cgpa = student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa).toFixed(2) : "N/A";

  return (
    <div className="ucms-container">
      {/* HEADER */}
      <div className="page-header-flex">
        <div>
          <div className="breadcrumb">
            <Link to="/">UCMS Home</Link> <span>/</span> <Link to="/students">Student Directory</Link> <span>/</span> <span className="current">Profile #{student.id}</span>
          </div>
          <h1 className="page-heading">Student Academic Profile</h1>
          <p className="page-subheading">
            Official university registration and scholastic dossier
          </p>
        </div>
        <div className="header-actions">
          <Link to={`/students/edit/${student.id}`} className="btn btn-primary">
            Edit Record
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Student
          </button>
          <Link to="/students" className="btn btn-secondary">
            ← Directory
          </Link>
        </div>
      </div>

      {/* STUDENT PROFILE CARD BANNER */}
      <div className="ucms-card profile-banner-card">
        <div className="profile-banner-content">
          <div className="profile-large-avatar">
            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div className="profile-main-meta">
            <h2 className="profile-name">{student.name}</h2>
            <div className="profile-meta-tags">
              <span className="badge badge-neutral font-mono">Roll/ID: #{student.id}</span>
              <span className="badge badge-course">{courseTitle}</span>
              <span className={`cgpa-badge ${student.cgpa >= 8.5 ? "cgpa-high" : student.cgpa >= 7.0 ? "cgpa-mid" : "cgpa-pass"}`}>
                CGPA: {cgpa} / 10.0
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              📧 {student.email}
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED INFO GRIDS */}
      <div className="profile-info-grid">
        {/* ACADEMIC STANDING */}
        <div className="ucms-card">
          <h3 className="card-title-sm">🎓 Academic Program Details</h3>
          <div className="info-table-list">
            <div className="info-row">
              <span className="info-label">Degree / Program:</span>
              <span className="info-val font-semibold">{courseTitle}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Program Duration:</span>
              <span className="info-val">{duration}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Cumulative GPA (10.0):</span>
              <span className="info-val font-semibold text-blue-700">{cgpa} / 10.00</span>
            </div>
            <div className="info-row">
              <span className="info-label">Academic Status:</span>
              <span className="info-val">
                {student.cgpa >= 8.5 ? "Dean's Honors List" : student.cgpa >= 6.0 ? "Good Standing" : "Needs Review"}
              </span>
            </div>
          </div>
        </div>

        {/* RESIDENTIAL & CONTACT */}
        <div className="ucms-card">
          <h3 className="card-title-sm">📍 Residential & Contact Records</h3>
          <div className="info-table-list">
            <div className="info-row">
              <span className="info-label">City / Town:</span>
              <span className="info-val">{city}</span>
            </div>
            <div className="info-row">
              <span className="info-label">State / Province:</span>
              <span className="info-val">{state}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Postal / Pincode:</span>
              <span className="info-val font-mono">{pincode}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Registered Email:</span>
              <span className="info-val">{student.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;