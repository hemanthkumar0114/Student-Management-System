import { describe, it, expect, beforeEach } from "vitest";
import {
  getAuthToken,
  getStoredUser,
  setAuthData,
  clearAuthData,
  getAuthHeaders
} from "./authService";

describe("authService helper functions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getAuthToken", () => {
    it("returns null when no token is present", () => {
      expect(getAuthToken()).toBeNull();
    });

    it("returns the token when stored in localStorage", () => {
      localStorage.setItem("ucms_token", "sample-test-jwt-token");
      expect(getAuthToken()).toBe("sample-test-jwt-token");
    });
  });

  describe("getStoredUser", () => {
    it("returns null when no user is stored", () => {
      expect(getStoredUser()).toBeNull();
    });

    it("returns parsed user object when valid JSON is stored", () => {
      const user = { id: 1, username: "admin", role: "ROLE_ADMIN" };
      localStorage.setItem("ucms_user", JSON.stringify(user));
      expect(getStoredUser()).toEqual(user);
    });

    it("returns null when invalid JSON is stored in localStorage", () => {
      localStorage.setItem("ucms_user", "invalid-json-string{");
      expect(getStoredUser()).toBeNull();
    });
  });

  describe("setAuthData", () => {
    it("stores token and serialized user in localStorage", () => {
      const token = "token-xyz";
      const user = { id: 42, username: "student1", role: "ROLE_USER" };
      setAuthData(token, user);

      expect(localStorage.getItem("ucms_token")).toBe(token);
      expect(JSON.parse(localStorage.getItem("ucms_user"))).toEqual(user);
    });
  });

  describe("clearAuthData", () => {
    it("removes both token and user from localStorage", () => {
      localStorage.setItem("ucms_token", "token-to-remove");
      localStorage.setItem("ucms_user", JSON.stringify({ id: 1 }));

      clearAuthData();

      expect(localStorage.getItem("ucms_token")).toBeNull();
      expect(localStorage.getItem("ucms_user")).toBeNull();
    });
  });

  describe("getAuthHeaders", () => {
    it("returns only Content-Type header when unauthenticated", () => {
      const headers = getAuthHeaders();
      expect(headers).toEqual({
        "Content-Type": "application/json"
      });
    });

    it("returns Content-Type and Authorization Bearer header when authenticated", () => {
      localStorage.setItem("ucms_token", "active-jwt-token");
      const headers = getAuthHeaders();
      expect(headers).toEqual({
        "Content-Type": "application/json",
        "Authorization": "Bearer active-jwt-token"
      });
    });
  });
});
