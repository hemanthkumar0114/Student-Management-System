const API_URL = "http://localhost:8080/students";


export const addStudent = async (student) => {

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error("Failed to add student");
  }

  return response.json();
};


export const getStudents = async (
  page = 0, 
  size = 10,
  sortBy= "id",
  direction = "asc"
) => {

  const response = await fetch(
    `${API_URL}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
};


export const deleteStudent = async (id) => {

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }

  return response.text();
};


export const updateStudent = async (student) => {

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    throw new Error("Failed to update student");
  }

  return response.json();
};


export const searchStudents = async (name) => {

  const response = await fetch(
    `${API_URL}/search?name=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search students");
  }

  return response.json();
};
export const getStudentsById = async (id) => {
  const response = await fetch (`${API_URL}/${id}`);
  if(!response.ok){
    throw new Error("Failed to fetch student")
  }
  return response.json();
};