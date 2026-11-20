import { authFetch } from "./authService";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/students`;

// =========================================================
// GET ALL STUDENTS (PAGINATED + OPTIONAL SEARCH)
// =========================================================
export const getStudents = async (query = "", page = null, size = 20) => {
  const params = new URLSearchParams();

  if (page !== null) {
    params.set("page", String(page));
    params.set("size", String(size));
    params.set("sort", "id,asc");
  }

  if (query.trim()) {
    params.set("search", query.trim());
  }

  const url = params.toString()
    ? `${API_URL}?${params.toString()}`
    : API_URL;

  const response = await authFetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch students");
  }

  const data = await response.json();

  // Preserve the old array response for existing components.
  if (page === null) {
    return Array.isArray(data) ? data : (data.content || []);
  }

  // Return complete pagination information for Students.jsx.
  return data;
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
  const response = await authFetch(
    `${API_URL}/search?query=${encodeURIComponent(query)}`
  );

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