import { authFetch } from "./authService";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/students`;
// =========================================================
// GET ALL STUDENTS (Optional search query)
// =========================================================
export const getStudents = async (query = "") => {
  const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
  const response = await authFetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch students");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.content || []);
};

// =========================================================
// GET STUDENT BY ID
// =========================================================
export const getStudentById = async (id) => {
  if (!id || id === ":id" || id === "undefined") {
    throw new Error("Invalid student ID");
  }
  const response = await authFetch(`${API_URL}/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch student details");
  }
  return response.json();
};

// =========================================================
// ADD STUDENT
// =========================================================
export const addStudent = async (student) => {
  const response = await authFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add student");
  }
  return response.json();
};

// =========================================================
// UPDATE STUDENT
// =========================================================
export const updateStudent = async (idOrStudent, studentData) => {
  let id = idOrStudent;
  let body = studentData;

  if (typeof idOrStudent === "object" && idOrStudent !== null) {
    id = idOrStudent.id;
    body = idOrStudent;
  }

  if (!id) {
    throw new Error("Student ID is required for update");
  }

  const response = await authFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update student");
  }
  return response.json();
};

// =========================================================
// DELETE STUDENT
// =========================================================
export const deleteStudent = async (id) => {
  if (!id || id === ":id") {
    throw new Error("Invalid student ID");
  }

  const response = await authFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete student");
  }
  return response.text();
};

// =========================================================
// SEARCH STUDENTS
// =========================================================
export const searchStudents = async (query) => {
  const response = await authFetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to search students");
  }
  return response.json();
};

// =========================================================
// GET STUDENT STATS
// =========================================================
export const getStudentStats = async () => {
  const response = await authFetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch campus stats");
  }
  return response.json();
};