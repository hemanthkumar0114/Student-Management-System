import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseById } from "../services/courseService";
import { getStudents } from "../services/studentService";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourseAndStudents();
  }, [id]);

  const loadCourseAndStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseData, studentsData] = await Promise.all([
        getCourseById(id),
        getStudents("").catch(() => [])
      ]);

      setCourse(courseData);

      const allStudents = Array.isArray(studentsData) ? studentsData : (studentsData.content || []);
      const matched = allStudents.filter(
        (s) =>
          (s.courseId && String(s.courseId) === String(id)) ||
          (s.course && String(s.course.id) === String(id)) ||
          (s.courseName && courseData && s.courseName === courseData.courseName)
      );

      setEnrolledStudents(matched);
    } catch (err) {
      console.error("Course Details Error:", err);
      setError("Failed to load course details from server.");
    } finally {
      setLoading(false);
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

  if (error || !course) {
    return (
      <div className="ucms-container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2>Course Not Found</h2>
          <p>{error || "No academic course found with the specified identification number."}</p>
          <Link to="/courses" className="btn btn-primary btn-sm">
            ← Return to Course Catalog
          </Link>
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
            <Link to="/">UCMS Home</Link> <span>/</span> <Link to="/courses">Course Catalog</Link> <span>/</span> <span className="current">{course.courseName}</span>
          </div>
          <h1 className="page-heading">Degree Program Dossier</h1>
          <p className="page-subheading">
            Department curriculum, duration parameters, and student enrollment roster
          </p>
        </div>
        <div className="header-actions">
          <Link to={`/courses/edit/${course.id}`} className="btn btn-primary">
            Edit Course
          </Link>
          <Link to="/students/add" className="btn btn-secondary">
            + Enroll Student
          </Link>
          <Link to="/courses" className="btn btn-secondary">
            ← Catalog
          </Link>
        </div>
      </div>

      {/* COURSE OVERVIEW BANNER */}
      <div className="ucms-card profile-banner-card">
        <div className="profile-banner-content">
          <div className="profile-large-avatar bg-indigo-light">
            📚
          </div>
          <div className="profile-main-meta">
            <h2 className="profile-name">{course.courseName}</h2>
            <div className="profile-meta-tags">
              <span className="badge badge-neutral font-mono">Course ID: #{course.id}</span>
              <span className="badge badge-course">Duration: {course.duration}</span>
              <span className="badge badge-emerald">{enrolledStudents.length} Active Enrolments</span>
            </div>
            {course.department && (
              <p className="text-sm text-slate-600 mt-2">
                🏛️ <strong>Department:</strong> {course.department}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ENROLLED STUDENTS SECTION */}
      <div className="ucms-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">Enrolled Students Roster</h2>
            <p className="card-subtitle">Students currently registered under this curriculum</p>
          </div>
          <span className="badge badge-neutral">{enrolledStudents.length} Enrolled</span>
        </div>

        {enrolledStudents.length === 0 ? (
          <div className="empty-state">
            <p>No students currently enrolled in this degree program.</p>
            <Link to="/students/add" className="btn btn-primary btn-sm">
              + Enroll a Student
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="ucms-table">
              <thead>
                <tr>
                  <th>Roll / ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>CGPA (/10.0)</th>
                  <th>Location</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="font-mono text-slate-500 font-semibold">#{student.id}</td>
                    <td className="font-semibold">{student.name}</td>
                    <td className="text-slate-600 text-sm">{student.email}</td>
                    <td>
                      <span className={`cgpa-badge ${student.cgpa >= 8.5 ? "cgpa-high" : student.cgpa >= 7.0 ? "cgpa-mid" : "cgpa-pass"}`}>
                        {student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa).toFixed(2) : "N/A"} / 10.0
                      </span>
                    </td>
                    <td className="text-slate-600 text-sm">
                      {student.city ? `${student.city}, ${student.state || ""}` : "Not Specified"}
                    </td>
                    <td className="text-right actions-cell">
                      <Link to={`/students/${student.id}`} className="btn-action btn-view">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;