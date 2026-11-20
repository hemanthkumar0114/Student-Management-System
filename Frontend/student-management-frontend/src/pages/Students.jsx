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

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(currentPage, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, search]);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Course Load Error:", err));
  }, []);

  const loadData = async (page = 0, query = "") => {
    try {
      setLoading(true);
      setError("");

      const studentsData = await getStudents(query, page, PAGE_SIZE);

      setStudents(studentsData.content || []);
      setCurrentPage(studentsData.number ?? page);
      setTotalPages(studentsData.totalPages ?? 0);
      setTotalElements(studentsData.totalElements ?? 0);
    } catch (err) {
      console.error("Students Page Load Error:", err);
      setError("Unable to retrieve student records from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, studentName) => {
    const confirm = window.confirm(
      `Are you sure you want to permanently delete student record for "${studentName}" (ID: ${id})?`
    );

    if (!confirm) return;

    try {
      await deleteStudent(id);

      setActionMessage(`Student "${studentName}" removed successfully.`);
      setTimeout(() => setActionMessage(""), 4000);

      const nextPage =
        students.length === 1 && currentPage > 0
          ? currentPage - 1
          : currentPage;

      setCurrentPage(nextPage);

      await loadData(nextPage, search);
    } catch (err) {
      console.error("Delete Student Error:", err);
      setError(err.message || "Failed to delete student record.");
    }
  };

  // Course filtering applies to the currently loaded page.
  const filteredStudents = students.filter((s) => {
    return (
      selectedCourse === "ALL" ||
      (s.courseId && String(s.courseId) === String(selectedCourse)) ||
      (s.course && String(s.course.id) === String(selectedCourse)) ||
      (s.courseName && s.courseName ===
        courses.find((c) => String(c.id) === String(selectedCourse))?.courseName)
    );
  });

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCourse("ALL");
    setCurrentPage(0);
  };

  return (
    <div className="ucms-container">
      <div className="page-header-flex">
        <div>
          <div className="breadcrumb">
            <Link to="/">UCMS Home</Link> <span>/</span>{" "}
            <span className="current">Student Directory</span>
          </div>

          <h1 className="page-heading">Student Directory</h1>

          <p className="page-subheading">
            Official student registry, academic status, and contact records
          </p>
        </div>

        <div className="header-actions">
          <Link to="/students/add" className="btn btn-primary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
          <button
            className="alert-close"
            onClick={() => setActionMessage("")}
          >
            &times;
          </button>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error">
          <span>⚠️ {error}</span>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => loadData(currentPage, search)}
          >
            Retry
          </button>
        </div>
      )}

      <div className="ucms-card toolbar-card">
        <div className="toolbar-grid">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by student name, email, city, state, pincode, course..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {search && (
              <button
                className="clear-btn"
                onClick={() => handleSearchChange("")}
              >
                &times;
              </button>
            )}
          </div>

          <div className="filter-item">
            <label className="filter-label">Filter by Course:</label>

            <select
              className="form-control"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
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

      <div className="ucms-card">
        <div className="card-header-flex">
          <h2 className="card-title">
            Registered Students{" "}
            <span className="badge badge-neutral">
              {totalElements}
            </span>
          </h2>

          {(search || selectedCourse !== "ALL") && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
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
              {totalElements === 0
                ? "There are currently no matching students."
                : "No students on this page match the selected course."}
            </p>

            <button
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
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
                    const cityName =
                      student.city ||
                      (student.address && student.address.city) ||
                      "N/A";

                    const stateName =
                      student.state ||
                      (student.address && student.address.state) ||
                      "N/A";

                    const pincodeVal =
                      student.pincode ||
                      (student.address && student.address.pincode) ||
                      "N/A";

                    const courseTitle =
                      student.courseName ||
                      (student.course && student.course.courseName) ||
                      "Unassigned";

                    return (
                      <tr key={student.id}>
                        <td className="font-mono text-slate-500 font-semibold">
                          #{student.id}
                        </td>

                        <td>
                          <div className="student-profile-cell">
                            <div className="avatar-circle">
                              {student.name
                                ? student.name.charAt(0).toUpperCase()
                                : "S"}
                            </div>

                            <Link
                              to={`/students/${student.id}`}
                              className="student-name-link"
                            >
                              {student.name}
                            </Link>
                          </div>
                        </td>

                        <td className="text-slate-600 text-sm">
                          {student.email}
                        </td>

                        <td>
                          <span className="badge badge-course">
                            {courseTitle}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`cgpa-badge ${
                              student.cgpa >= 8.5
                                ? "cgpa-high"
                                : student.cgpa >= 7.0
                                ? "cgpa-mid"
                                : "cgpa-pass"
                            }`}
                          >
                            {student.cgpa !== undefined &&
                            student.cgpa !== null
                              ? Number(student.cgpa).toFixed(2)
                              : "N/A"}

                            <span className="text-xs opacity-75">
                              {" "}/ 10.0
                            </span>
                          </span>
                        </td>

                        <td className="text-slate-700 text-sm">
                          {cityName}
                        </td>

                        <td className="text-slate-700 text-sm">
                          {stateName}
                        </td>

                        <td className="font-mono text-slate-600 text-sm">
                          {pincodeVal}
                        </td>

                        <td className="text-right actions-cell">
                          <Link
                            to={`/students/${student.id}`}
                            className="btn-action btn-view"
                            title="View Full Profile"
                          >
                            View
                          </Link>

                          <Link
                            to={`/students/edit/${student.id}`}
                            className="btn-action btn-edit"
                            title="Edit Student"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn-action btn-delete"
                            title="Delete Student"
                            onClick={() =>
                              handleDelete(student.id, student.name)
                            }
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

            <div
              className="pagination-controls"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                padding: "20px 0 5px",
              }}
            >
              <span>
                Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
                {" · "}
                {totalElements} total students
              </span>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === 0 || loading}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Previous
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  disabled={
                    currentPage >= totalPages - 1 ||
                    totalPages === 0 ||
                    loading
                  }
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Students;