package com.example.Hibernate;

import com.example.Hibernate.DTO.ErrorResponse;
import com.example.Hibernate.DTO.LoginRequest;
import com.example.Hibernate.DTO.LoginResponse;
import com.example.Hibernate.DTO.UserResponseDTO;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Support.ApiTestSupport;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class AuthTests extends ApiTestSupport {

    @Test
    @DisplayName("Login Success with Username - /auth/login and /api/auth/login")
    void loginSuccess() {
        String username = unique("user");
        String email = username + "@example.com";
        String password = "securePassword123";
        createTestUser(username, email, password, Role.USER, true);

        LoginRequest request = new LoginRequest(username, password);

        ResponseEntity<LoginResponse> response1 = restTemplate.postForEntity("/auth/login", request, LoginResponse.class);
        assertEquals(HttpStatus.OK, response1.getStatusCode());
        assertNotNull(response1.getBody());
        assertNotNull(response1.getBody().getToken());
        assertEquals(username, response1.getBody().getUsername());
        assertEquals(Role.USER, response1.getBody().getRole());

        ResponseEntity<LoginResponse> response2 = restTemplate.postForEntity("/api/auth/login", request, LoginResponse.class);
        assertEquals(HttpStatus.OK, response2.getStatusCode());
        assertNotNull(response2.getBody());
        assertNotNull(response2.getBody().getToken());
    }

    @Test
    @DisplayName("Login Bad Password - Returns 401 with ErrorResponse shape")
    void loginBadPassword() {
        String username = unique("user");
        String email = username + "@example.com";
        createTestUser(username, email, "correctPassword", Role.USER, true);

        LoginRequest request = new LoginRequest(username, "wrongPassword");
        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity("/auth/login", request, ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(401, response.getBody().getStatus());
        assertEquals("/auth/login", response.getBody().getPath());
        assertNotNull(response.getBody().getErrors());
    }

    @Test
    @DisplayName("Login Unknown Username - Returns 401 with ErrorResponse shape")
    void loginUnknownUser() {
        LoginRequest request = new LoginRequest("nonExistentUser999", "anyPassword");
        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity("/auth/login", request, ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(401, response.getBody().getStatus());
    }

    @Test
    @DisplayName("Login Disabled Account - Returns 401")
    void loginDisabledUser() {
        String username = unique("disabled");
        String email = username + "@example.com";
        String password = "password123";
        createTestUser(username, email, password, Role.USER, false);

        LoginRequest request = new LoginRequest(username, password);
        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity("/auth/login", request, ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @DisplayName("Get Current User (/auth/me and /api/auth/me) with Valid Token")
    void getCurrentUserSuccess() {
        String username = unique("me_user");
        String email = username + "@example.com";
        String password = "password123";
        createTestUser(username, email, password, Role.USER, true);

        String token = obtainToken(username, password);
        HttpEntity<Void> entity = new HttpEntity<>(authHeaders(token));

        ResponseEntity<UserResponseDTO> response1 = restTemplate.exchange("/auth/me", HttpMethod.GET, entity, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, response1.getStatusCode());
        assertNotNull(response1.getBody());
        assertEquals(username, response1.getBody().getUsername());

        ResponseEntity<UserResponseDTO> response2 = restTemplate.exchange("/api/auth/me", HttpMethod.GET, entity, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, response2.getStatusCode());
        assertNotNull(response2.getBody());
        assertEquals(username, response2.getBody().getUsername());
    }

    @Test
    @DisplayName("Get Current User (/auth/me) Unauthenticated - Returns 401 ErrorResponse")
    void getCurrentUserUnauthenticated() {
        ResponseEntity<ErrorResponse> response = restTemplate.getForEntity("/auth/me", ErrorResponse.class);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(401, response.getBody().getStatus());
    }
}
