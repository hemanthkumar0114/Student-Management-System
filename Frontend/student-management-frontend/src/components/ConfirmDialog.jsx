import React from "react";

function ConfirmDialog({ isOpen, title, message, studentName, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-container confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        
        <h3 className="confirm-title">{title || "Confirm Deletion"}</h3>
        <p className="confirm-text">
          {message || "Are you sure you want to delete this student record? This action cannot be undone."}
        </p>

        {studentName && (
          <div className="confirm-target-box">
            <strong>Student:</strong> {studentName}
          </div>
        )}

        <div className="confirm-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              "Yes, Delete Record"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
