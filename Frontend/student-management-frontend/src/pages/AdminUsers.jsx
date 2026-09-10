import React, { useState, useEffect } from "react";
import { getAllUsers, createUser, updateUser, toggleUserStatus, deleteUser } from "../services/userService";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    enabled: true
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "USER",
      enabled: true
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Optional for password reset
      role: user.role,
      enabled: user.enabled
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.username.trim() || !formData.email.trim()) {
      setFormError("Username and Email are required.");
      return;
    }

    if (modalMode === "create" && !formData.password.trim()) {
      setFormError("Password is required for new accounts.");
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === "create") {
        await createUser({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          role: formData.role
        });
        setToast({ type: "success", message: `User account '${formData.username}' created successfully!` });
      } else {
        const updatePayload = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          role: formData.role,
          enabled: formData.enabled
        };
        if (formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }
        await updateUser(selectedUser.id, updatePayload);
        setToast({ type: "success", message: `User account '${formData.username}' updated successfully!` });
      }

      setIsModalOpen(false);
      fetchUsersList();
    } catch (err) {
      setFormError(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);
      setToast({
        type: "info",
        message: `Account status for '${user.username}' changed to ${!user.enabled ? "Enabled" : "Disabled"}`
      });
      fetchUsersList();
    } catch (err) {
      setToast({ type: "danger", message: err.message || "Failed to update account status" });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setToast({ type: "success", message: `User '${deleteTarget.username}' deleted successfully!` });
      setDeleteTarget(null);
      fetchUsersList();
    } catch (err) {
      setToast({ type: "danger", message: err.message || "Failed to delete user" });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="ucms-container">
      {/* PAGE HEADER */}
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <span className="badge badge-purple mb-1">Administrative Gateway</span>
          <h1 className="page-title">User Accounts Management</h1>
          <p className="page-subtitle">View and manage registered user credentials, roles, and status flags.</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New User Account
        </button>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {error && (
        <div className="alert alert-danger mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* USERS TABLE CARD */}
      <div className="ucms-card">
        <div className="ucms-card-header flex justify-between items-center">
          <div>
            <h2 className="ucms-card-title">Registered Accounts Directory</h2>
            <p className="ucms-card-subtitle">All authentication records stored in MySQL database</p>
          </div>
          <span className="badge badge-blue">{users.length} Total Users</span>
        </div>

        <div className="ucms-card-body p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading user accounts...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No user accounts found.</div>
          ) : (
            <table className="ucms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td className="font-semibold text-slate-800">{u.username}</td>
                    <td className="text-slate-600">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === "ADMIN" ? "badge-purple" : "badge-blue"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`status-toggle-btn ${u.enabled ? "status-active" : "status-disabled"}`}
                        title="Click to toggle account status"
                      >
                        <span className="status-dot"></span>
                        {u.enabled ? "Active / Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td className="text-xs text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell justify-end">
                        <button
                          onClick={() => openEditModal(u)}
                          className="btn btn-xs btn-outline"
                          title="Edit User Role / Status / Reset Password"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="btn btn-xs btn-danger-outline"
                          title="Delete User Account"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="ucms-modal-backdrop">
          <div className="ucms-modal-card">
            <div className="ucms-modal-header">
              <h3 className="ucms-modal-title">
                {modalMode === "create" ? "Create User Account" : `Edit User: ${selectedUser?.username}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>

            {formError && (
              <div className="alert alert-danger mx-6 mt-4 mb-0">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="ucms-modal-body">
              <div className="form-group mb-4">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. john_doe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">
                  {modalMode === "create" ? "Password" : "Reset Password (leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={modalMode === "create" ? "Minimum 6 characters" : "New password (optional)"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={modalMode === "create"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">System Role</label>
                  <select
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="USER">USER (Standard Access)</option>
                    <option value="ADMIN">ADMIN (Full Privileges)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select
                    className="form-select"
                    value={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.value === "true" })}
                  >
                    <option value="true">Enabled / Active</option>
                    <option value="false">Disabled / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="ucms-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : modalMode === "create" ? "Create Account" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete User Account"
          message={`Are you sure you want to permanently delete the user account '${deleteTarget.username}' (${deleteTarget.email})? This action cannot be undone.`}
          confirmLabel="Delete Account"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default AdminUsers;
