const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;
export const getAuthToken = () => {
  return localStorage.getItem("ucms_token");
};

export const getStoredUser = () => {
  const userJson = localStorage.getItem("ucms_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const setAuthData = (token, user) => {
  localStorage.setItem("ucms_token", token);
  localStorage.setItem("ucms_user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("ucms_token");
  localStorage.removeItem("ucms_user");
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }
  return {
    "Content-Type": "application/json"
  };
};

export const authFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    clearAuthData();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
};

export const loginApi = async (usernameOrEmail, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usernameOrEmail, password })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Invalid username/email or password.");
  }

  const { token, id, username, email, role, enabled } = data;
  const user = { id, username, email, role, enabled };
  setAuthData(token, user);
  return { token, user };
};

export const getCurrentUserApi = async () => {
  const response = await authFetch(`${API_URL}/me`);

  if (!response.ok) {
    clearAuthData();
    throw new Error("Session expired or invalid");
  }

  return response.json();
};
