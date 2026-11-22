package com.example.Hibernate;

import com.example.Hibernate.DTO.ErrorResponse;
import com.example.Hibernate.DTO.LoginRequest;
import com.example.Hibernate.DTO.LoginResponse;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Security.LoginAttemptService;
import com.example.Hibernate.Support.ApiTestSupport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class LoginLockoutTests extends ApiTestSupport {

    @Autowired
    private LoginAttemptService loginAttemptService;

    @BeforeEach
    void setUp() {
        loginAttemptService.reset();
    }

    @Test
    @DisplayName("5 consecutive failed logins trigger 429 lockout")
    void lockoutAfter5FailedAttempts() {
        String username = unique("lockout");
        String email = username + "@example.com";
        String password = "correctPassword123";
        createTestUser(username, email, password, Role.USER, true);

        for (int i = 0; i < 5; i++) {
            LoginRequest badRequest = new LoginRequest(username, "wrongPassword");
            ResponseEntity<ErrorResponse> failResponse = restTemplate.postForEntity("/auth/login", badRequest, ErrorResponse.class);
            assertEquals(HttpStatus.UNAUTHORIZED, failResponse.getStatusCode());
        }

        LoginRequest attemptDuringLockout = new LoginRequest(username, password);
        ResponseEntity<ErrorResponse> lockedResponse = restTemplate.postForEntity("/auth/login", attemptDuringLockout, ErrorResponse.class);

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, lockedResponse.getStatusCode());
        assertNotNull(lockedResponse.getBody());
        assertEquals(429, lockedResponse.getBody().getStatus());
        assertTrue(lockedResponse.getBody().getMessage().contains("Too many failed login attempts"));
    }

    @Test
    @DisplayName("Successful login clears failed attempts counter")
    void successClearsFailedAttempts() {
        String username = unique("clear_lockout");
        String email = username + "@example.com";
        String password = "correctPassword123";
        createTestUser(username, email, password, Role.USER, true);

        for (int i = 0; i < 4; i++) {
            LoginRequest badRequest = new LoginRequest(username, "wrongPassword");
            ResponseEntity<ErrorResponse> failResponse = restTemplate.postForEntity("/auth/login", badRequest, ErrorResponse.class);
            assertEquals(HttpStatus.UNAUTHORIZED, failResponse.getStatusCode());
        }

        LoginRequest successRequest = new LoginRequest(username, password);
        ResponseEntity<LoginResponse> successResponse = restTemplate.postForEntity("/auth/login", successRequest, LoginResponse.class);
        assertEquals(HttpStatus.OK, successResponse.getStatusCode());

        for (int i = 0; i < 4; i++) {
            LoginRequest badRequest = new LoginRequest(username, "wrongPassword");
            ResponseEntity<ErrorResponse> failResponse = restTemplate.postForEntity("/auth/login", badRequest, ErrorResponse.class);
            assertEquals(HttpStatus.UNAUTHORIZED, failResponse.getStatusCode());
        }

        ResponseEntity<LoginResponse> finalSuccessResponse = restTemplate.postForEntity("/auth/login", successRequest, LoginResponse.class);
        assertEquals(HttpStatus.OK, finalSuccessResponse.getStatusCode());
    }
}
