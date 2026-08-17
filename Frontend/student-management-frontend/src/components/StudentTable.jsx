import React from "react";

function getDepartmentColorClass(dept = "") {
  const d = dept.toLowerCase();
  if (d.includes("computer") || d.includes("cs")) return "dept-blue";
  if (d.includes("information") || d.includes("it")) return "dept-indigo";
  if (d.includes("data") || d.includes("ai") || d.includes("artificial")) return "dept-purple";
  if (d.includes("electronic") || d.includes("electrical")) return "dept-emerald";
  if (d.includes("mechanical")) return "dept-orange";
  if (d.includes("business")) return "dept-amber";
  return "dept-gray";
}

function getGpaBadgeClass(gpa) {
  const score = parseFloat(gpa);
  if (isNaN(score)) return "gpa-gray";
  if (score >= 3.7) return "gpa-high";
  if (score >= 3.0) return "gpa-medium";
  return "gpa-low";
}

function getInitials(firstName = "", lastName = "") {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  return `${f}${l}` || "ST";
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

function StudentTable({ students = [], loading, onEdit, onDelete, onAddNew }) {
  if (loading) {
    return (
      <div className="table-responsive card">
        <table className="student-data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>GPA</th>
              <th>Enrolled On</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((idx) => (
              <tr key={idx} className="skeleton-row">
                <td><div className="skeleton-line" style={{ width: "80px" }}></div></td>
                <td>
                  <div className="student-name-cell">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-line" style={{ width: "120px" }}></div>
                  </div>
                </td>
                <td><div className="skeleton-line" style={{ width: "160px" }}></div></td>
                <td><div className="skeleton-pill" style={{ width: "110px" }}></div></td>
                <td><div className="skeleton-pill" style={{ width: "60px" }}></div></td>
                <td><div className="skeleton-line" style={{ width: "90px" }}></div></td>
                <td><div className="skeleton-line float-right" style={{ width: "100px" }}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="empty-state-card card">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3 className="empty-state-title">No Students Found</h3>
        <p className="empty-state-text">
          No student records matched your search query or selected department filter.
        </p>
        {onAddNew && (
          <button className="btn btn-primary" onClick={onAddNew}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add New Student</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive card">
      <table className="student-data-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>GPA</th>
            <th>Enrolled On</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
            const deptClass = getDepartmentColorClass(student.department);
            const gpaClass = getGpaBadgeClass(student.gpa);
            const initials = getInitials(student.firstName, student.lastName);

            return (
              <tr key={student.id} className="student-row">
                {/* ROLL NUMBER */}
                <td>
                  <span className="roll-pill">{student.rollNumber}</span>
                </td>

                {/* FULL NAME WITH AVATAR */}
                <td>
                  <div className="student-name-cell">
                    <div className={`student-avatar ${deptClass}`}>
                      {initials}
                    </div>
                    <div className="student-name-info">
                      <span className="student-full-name">{fullName}</span>
                      <span className="student-id-sub">ID: #{student.id}</span>
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td>
                  <a href={`mailto:${student.email}`} className="email-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{student.email}</span>
                  </a>
                </td>

                {/* DEPARTMENT */}
                <td>
                  <span className={`dept-badge ${deptClass}`}>
                    {student.department}
                  </span>
                </td>

                {/* GPA */}
                <td>
                  <span className={`gpa-badge ${gpaClass}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>{typeof student.gpa === "number" ? student.gpa.toFixed(2) : student.gpa}</span>
                  </span>
                </td>

                {/* ENROLLMENT DATE */}
                <td>
                  <span className="date-text">{formatDate(student.enrollmentDate)}</span>
                </td>

                {/* ACTIONS */}
                <td className="text-right">
                  <div className="action-buttons-group">
                    <button
                      type="button"
                      className="btn-action btn-edit"
                      onClick={() => onEdit(student)}
                      title="Edit student record"
                      aria-label={`Edit ${fullName}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-delete"
                      onClick={() => onDelete(student)}
                      title="Delete student record"
                      aria-label={`Delete ${fullName}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
