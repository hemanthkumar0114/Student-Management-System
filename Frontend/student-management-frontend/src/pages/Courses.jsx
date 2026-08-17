import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, deleteCourse } from "../services/courseService";
import { getStudents } from "../services/studentService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, studentsData] = await Promise.all([
        getCourses(),
        getStudents("").catch(() => [])
      ]);

      setCourses(Array.isArray(coursesData) ? coursesData : []);
      const sList = Array.isArray(studentsData) ? studentsData : (studentsData.content || []);
      setStudents(sList);
    } catch (err) {
      console.error("Course Loading Error:", err);
      setError("Failed to retrieve course records from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, courseName) => {
    const confirmed = window.confirm(`Are you sure you want to delete course "${courseName}" (ID: ${id})?`);
    if (!confirmed) return;

    try {
      await deleteCourse(id);
      setActionMessage(`Course "${courseName}" deleted successfully.`);
      setTimeout(() => setActionMessage(""), 4000);
      await loadData();
    } catch (err) {
      console.error("Delete Course Error:", err);
      setError(err.message || "Failed to delete course record.");
    }
  };

  // Helper to count enrolled students for each course
  const getEnrolledCount = (courseId, courseName) => {
    return students.filter(
      (s) =>
        (s.courseId && String(s.courseId) === String(courseId)) ||
        (s.course && String(s.course.id) === String(courseId)) ||
        (s.courseName && s.courseName === courseName)
    ).length;
  };

  return (
    <div className="ucms-container">
      {/* PAGE HEADER */}
      <div className="page-header-flex">
        <div>
          <div className="breadcrumb">
            <Link to="/">UCMS Home</Link> <span>/</span> <span className="current">Academic Courses</span>
          </div>
          <h1 className="page-heading">Academic Degree Programs & Courses</h1>
          <p className="page-subheading">
            Manage university departments, degrees, syllabi duration, and offerings
          </p>
        </div>
        <div>
          <Link to="/courses/add" className="btn btn-primary">
            + Add New Course
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

      <div className="ucms-card">
        <div className="card-header-flex">
          <h2 className="card-title">
            Course Catalog <span className="badge badge-neutral">{courses.length}</span>
          </h2>
        </div>

        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading course directory...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Courses Registered</h3>
            <p>There are currently no degree programs in the catalog.</p>
            <Link to="/courses/add" className="btn btn-primary btn-sm">
              + Register First Course
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="ucms-table">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Degree / Program Name</th>
                  <th>Duration</th>
                  <th>Enrolled Students</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const enrolled = getEnrolledCount(course.id, course.courseName);
                  return (
                    <tr key={course.id}>
                      <td className="font-mono text-slate-500 font-semibold">#{course.id}</td>
                      <td>
                        <Link to={`/courses/${course.id}`} className="student-name-link font-semibold">
                          {course.courseName}
                        </Link>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{course.duration}</span>
                      </td>
                      <td>
                        <span className="badge badge-course">{enrolled} Enrolled</span>
                      </td>
                      <td className="text-right actions-cell">
                        <Link to={`/courses/${course.id}`} className="btn-action btn-view" title="View Course Details">
                          View
                        </Link>
                        <Link to={`/courses/edit/${course.id}`} className="btn-action btn-edit" title="Edit Course">
                          Edit
                        </Link>
                        <button
                          className="btn-action btn-delete"
                          title="Delete Course"
                          onClick={() => handleDelete(course.id, course.courseName)}
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

export default Courses;