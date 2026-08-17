const API_URL = "http://localhost:8080/students";

// =========================================================
// GET ALL STUDENTS (Optional search query)
// =========================================================
export const getStudents = async (query = "") => {
  const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch students");
  }
  return response.json();
};

// =========================================================
// GET STUDENT BY ID
// =========================================================
export const getStudentById = async (id) => {
  if (!id || id === ":id" || id === "undefined") {
    throw new Error("Invalid student ID");
  }
  const response = await fetch(`${API_URL}/${id}`);
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
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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

  const response = await fetch(`${API_URL}/${id}`, {
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
  const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to search students");
  }
  return response.json();
};

// =========================================================
// GET STUDENT STATS
// =========================================================
export const getStudentStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch campus stats");
  }
  return response.json();
};