import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:8080/courses";

// =========================================================
// GET ALL COURSES
// =========================================================
export const getCourses = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch courses");
  }
  return response.json();
};

// =========================================================
// GET COURSE BY ID
// =========================================================
export const getCourseById = async (id) => {
  if (!id || id === ":id") {
    throw new Error("Invalid course ID");
  }
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch course");
  }
  return response.json();
};

// =========================================================
// ADD COURSE
// =========================================================
export const addCourse = async (course) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add course");
  }
  return response.json();
};

// =========================================================
// UPDATE COURSE
// =========================================================
export const updateCourse = async (idOrCourse, courseData) => {
  let id = idOrCourse;
  let body = courseData;

  if (typeof idOrCourse === "object" && idOrCourse !== null) {
    id = idOrCourse.id;
    body = idOrCourse;
  }

  if (!id) {
    throw new Error("Course ID is required for update");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update course");
  }
  return response.json();
};

// =========================================================
// DELETE COURSE
// =========================================================
export const deleteCourse = async (id) => {
  if (!id || id === ":id") {
    throw new Error("Invalid course ID");
  }
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete course");
  }
  return response.text();
};