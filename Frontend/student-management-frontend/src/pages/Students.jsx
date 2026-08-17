import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudents, deleteStudent } from "../services/studentService";
import { getCourses } from "../services/courseService";

function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, coursesData] = await Promise.all([
        getStudents(""),
        getCourses().catch(() => [])
      ]);

      const list = Array.isArray(studentsData) ? studentsData : (studentsData.content || []);
      setStudents(list);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      console.error("Students Page Load Error:", err);
      setError("Unable to retrieve student records from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, studentName) => {
    const confirm = window.confirm(`Are you sure you want to permanently delete student record for "${studentName}" (ID: ${id})?`);
    if (!confirm) return;

    try {
      await deleteStudent(id);
      setActionMessage(`Student "${studentName}" removed successfully.`);
      setTimeout(() => setActionMessage(""), 4000);
      await loadData();
    } catch (err) {
      console.error("Delete Student Error:", err);
      setError(err.message || "Failed to delete student record.");
    }
  };

  // Filter students based on search term & course filter
  const filteredStudents = students.filter((s) => {
    const cityName = s.city || (s.address && s.address.city) || "";
    const stateName = s.state || (s.address && s.address.state) || "";
    const pincodeVal = s.pincode || (s.address && s.address.pincode) || "";
    const courseTitle = s.courseName || (s.course && s.course.courseName) || "";

    const matchesSearch =
      search.trim() === "" ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      cityName.toLowerCase().includes(search.toLowerCase()) ||
      stateName.toLowerCase().includes(search.toLowerCase()) ||
      pincodeVal.toLowerCase().includes(search.toLowerCase()) ||
      courseTitle.toLowerCase().includes(search.toLowerCase());

    const matchesCourse =
      selectedCourse === "ALL" ||
      (s.courseId && String(s.courseId) === String(selectedCourse)) ||
      (s.course && String(s.course.id) === String(selectedCourse)) ||
      (s.courseName && s.courseName === selectedCourse);

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="ucms-container">
      {/* PAGE HEADER */}
      <div className="page-header-flex">
        <div>
          <div className="breadcrumb">
            <Link to="/">UCMS Home</Link> <span>/</span> <span className="current">Student Directory</span>
          </div>
          <h1 className="page-heading">Student Directory</h1>
          <p className="page-subheading">
            Official student registry, academic status, and contact records
          </p>
        </div>
        <div className="header-actions">
          <Link to="/students/add" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add New Student</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="alert-box alert-success">
          <span>✓ {actionMessage}</span>
          <button className="alert-close" onClick={() => setActionMessage("")}>&times;</button>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error">
          <span>⚠️ {error}</span>
          <button className="btn btn-sm btn-secondary" onClick={loadData}>Retry</button>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="ucms-card toolbar-card">
        <div className="toolbar-grid">
          {/* SEARCH INPUT */}
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by student name, email, city, state, pincode, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch("")}>&times;</button>
            )}
          </div>

          {/* COURSE FILTER DROPDOWN */}
          <div className="filter-item">
            <label className="filter-label">Filter by Course:</label>
            <select
              className="form-control"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="ALL">All Academic Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="ucms-card">
        <div className="card-header-flex">
          <h2 className="card-title">
            Registered Students <span className="badge badge-neutral">{filteredStudents.length}</span>
          </h2>
          {(search || selectedCourse !== "ALL") && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearch("");
                setSelectedCourse("ALL");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading student database...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Student Records Found</h3>
            <p>
              {students.length === 0
                ? "There are currently no students registered in the university database."
                : "No student records matched your search or filter criteria."}
            </p>
            {students.length === 0 ? (
              <Link to="/students/add" className="btn btn-primary btn-sm">
                + Register First Student
              </Link>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearch("");
                  setSelectedCourse("ALL");
                }}
              >
                Clear Search Query
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="ucms-table">
              <thead>
                <tr>
                  <th>Roll / ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>CGPA (/ 10.0)</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const cityName = student.city || (student.address && student.address.city) || "N/A";
                  const stateName = student.state || (student.address && student.address.state) || "N/A";
                  const pincodeVal = student.pincode || (student.address && student.address.pincode) || "N/A";
                  const courseTitle = student.courseName || (student.course && student.course.courseName) || "Unassigned";

                  return (
                    <tr key={student.id}>
                      <td className="font-mono text-slate-500 font-semibold">#{student.id}</td>
                      <td>
                        <div className="student-profile-cell">
                          <div className="avatar-circle">
                            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                          </div>
                          <Link to={`/students/${student.id}`} className="student-name-link">
                            {student.name}
                          </Link>
                        </div>
                      </td>
                      <td className="text-slate-600 text-sm">{student.email}</td>
                      <td>
                        <span className="badge badge-course">{courseTitle}</span>
                      </td>
                      <td>
                        <span className={`cgpa-badge ${student.cgpa >= 8.5 ? "cgpa-high" : student.cgpa >= 7.0 ? "cgpa-mid" : "cgpa-pass"}`}>
                          {student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa).toFixed(2) : "N/A"}
                          <span className="text-xs opacity-75"> / 10.0</span>
                        </span>
                      </td>
                      <td className="text-slate-700 text-sm">{cityName}</td>
                      <td className="text-slate-700 text-sm">{stateName}</td>
                      <td className="font-mono text-slate-600 text-sm">{pincodeVal}</td>
                      <td className="text-right actions-cell">
                        <Link to={`/students/${student.id}`} className="btn-action btn-view" title="View Full Profile">
                          View
                        </Link>
                        <Link to={`/students/edit/${student.id}`} className="btn-action btn-edit" title="Edit Student">
                          Edit
                        </Link>
                        <button
                          className="btn-action btn-delete"
                          title="Delete Student"
                          onClick={() => handleDelete(student.id, student.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;