import { authFetch } from "./authService";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/users`;
export const getAllUsers = async () => {
  const response = await authFetch(API_URL);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch user accounts");
  }
  return response.json();
};

export const createUser = async (userData) => {
  const response = await authFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create user account");
  }
  return response.json();
};

export const updateUser = async (id, userData) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update user account");
  }
  return response.json();
};

export const toggleUserStatus = async (id) => {
  const response = await authFetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update account status");
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete user account");
  }
  return response.json();
};
