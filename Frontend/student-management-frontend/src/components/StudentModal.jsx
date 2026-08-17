import React, { useState, useEffect } from "react";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Business Administration"
];

function StudentModal({ isOpen, onClose, onSave, studentToEdit, loading }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
    department: "Computer Science",
    gpa: "",
    enrollmentDate: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const isEditMode = Boolean(studentToEdit?.id);

  // Initialize or reset form when modal opens or studentToEdit changes
  useEffect(() => {
    if (isOpen) {
      setServerError("");
      setErrors({});
      if (studentToEdit) {
        setFormData({
          firstName: studentToEdit.firstName || "",
          lastName: studentToEdit.lastName || "",
          email: studentToEdit.email || "",
          rollNumber: studentToEdit.rollNumber || "",
          department: studentToEdit.department || "Computer Science",
          gpa: studentToEdit.gpa !== undefined && studentToEdit.gpa !== null ? String(studentToEdit.gpa) : "",
          enrollmentDate: studentToEdit.enrollmentDate || ""
        });
      } else {
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          rollNumber: "",
          department: "Computer Science",
          gpa: "",
          enrollmentDate: today
        });
      }
    }
  }, [isOpen, studentToEdit]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.trim().length < 2) error = "First name must be at least 2 characters";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;
      case "rollNumber":
        if (!value.trim()) error = "Roll number is required";
        break;
      case "department":
        if (!value.trim()) error = "Please select a department";
        break;
      case "gpa":
        if (value === "" || value === null || value === undefined) {
          error = "GPA is required";
        } else {
          const numGpa = parseFloat(value);
          if (isNaN(numGpa)) {
            error = "GPA must be a valid number";
          } else if (numGpa < 0 || numGpa > 4.0) {
            error = "GPA must be between 0.00 and 4.00";
          }
        }
        break;
      case "enrollmentDate":
        if (!value) error = "Enrollment date is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateAll()) {
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        rollNumber: formData.rollNumber.trim(),
        department: formData.department.trim(),
        gpa: parseFloat(formData.gpa),
        enrollmentDate: formData.enrollmentDate
      };

      await onSave(payload, studentToEdit?.id);
    } catch (err) {
      setServerError(err.message || "Failed to save student record.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container form-modal" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 className="modal-title">
                {isEditMode ? "Edit Student Record" : "Add New Student"}
              </h2>
              <p className="modal-subtitle">
                {isEditMode ? "Update student academic and personal details" : "Register a new student into the management system"}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        {/* SERVER ERROR BANNER */}
        {serverError && (
          <div className="modal-alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="student-form" noValidate>
          <div className="form-grid">
            {/* FIRST NAME */}
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="required-star">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                className={`form-input ${errors.firstName ? "input-error" : ""}`}
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.firstName && <span className="field-error-text">{errors.firstName}</span>}
            </div>

            {/* LAST NAME */}
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name <span className="required-star">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                className={`form-input ${errors.lastName ? "input-error" : ""}`}
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.lastName && <span className="field-error-text">{errors.lastName}</span>}
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="e.g. john.doe@university.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>

            {/* ROLL NUMBER */}
            <div className="form-group">
              <label htmlFor="rollNumber" className="form-label">
                Roll Number <span className="required-star">*</span>
              </label>
              <input
                id="rollNumber"
                type="text"
                name="rollNumber"
                className={`form-input ${errors.rollNumber ? "input-error" : ""}`}
                placeholder="e.g. CS-2024-045"
                value={formData.rollNumber}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.rollNumber && <span className="field-error-text">{errors.rollNumber}</span>}
            </div>

            {/* DEPARTMENT */}
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required-star">*</span>
              </label>
              <select
                id="department"
                name="department"
                className={`form-select ${errors.department ? "input-error" : ""}`}
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <span className="field-error-text">{errors.department}</span>}
            </div>

            {/* GPA */}
            <div className="form-group">
              <label htmlFor="gpa" className="form-label">
                GPA (0.00 - 4.00) <span className="required-star">*</span>
              </label>
              <input
                id="gpa"
                type="number"
                step="0.01"
                min="0.00"
                max="4.00"
                name="gpa"
                className={`form-input ${errors.gpa ? "input-error" : ""}`}
                placeholder="e.g. 3.85"
                value={formData.gpa}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.gpa && <span className="field-error-text">{errors.gpa}</span>}
            </div>

            {/* ENROLLMENT DATE */}
            <div className="form-group form-group-full">
              <label htmlFor="enrollmentDate" className="form-label">
                Enrollment Date <span className="required-star">*</span>
              </label>
              <input
                id="enrollmentDate"
                type="date"
                name="enrollmentDate"
                className={`form-input ${errors.enrollmentDate ? "input-error" : ""}`}
                value={formData.enrollmentDate}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.enrollmentDate && <span className="field-error-text">{errors.enrollmentDate}</span>}
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Saving Record...</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Create Student"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentModal;
