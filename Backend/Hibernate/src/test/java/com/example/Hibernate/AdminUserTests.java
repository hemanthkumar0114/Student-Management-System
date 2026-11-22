package com.example.Hibernate;

import com.example.Hibernate.DTO.ErrorResponse;
import com.example.Hibernate.DTO.UserCreateDTO;
import com.example.Hibernate.DTO.UserResponseDTO;
import com.example.Hibernate.DTO.UserUpdateDTO;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Support.ApiTestSupport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AdminUserTests extends ApiTestSupport {

    private String adminToken;

    @BeforeEach
    void setUp() {
        String aName = unique("adm_ctrl");
        createTestUser(aName, aName + "@example.com", "pass123", Role.ADMIN, true);
        adminToken = obtainToken(aName, "pass123");
    }

    @Test
    @DisplayName("Admin User Management Lifecycle: Create, GetAll, GetById, Update, ToggleStatus, Delete")
    void adminUserLifecycle() {
        String newUsername = unique("new_adm_user");
        String newEmail = newUsername + "@example.com";
        UserCreateDTO createDto = new UserCreateDTO(newUsername, newEmail, "secretPass123", Role.USER);

        ResponseEntity<UserResponseDTO> createRes = restTemplate.exchange("/admin/users", HttpMethod.POST, new HttpEntity<>(createDto, authHeaders(adminToken)), UserResponseDTO.class);
        assertEquals(HttpStatus.CREATED, createRes.getStatusCode());
        assertNotNull(createRes.getBody());
        Long createdId = createRes.getBody().getId();
        assertNotNull(createdId);

        ResponseEntity<List> getAllRes = restTemplate.exchange("/admin/users", HttpMethod.GET, new HttpEntity<>(authHeaders(adminToken)), List.class);
        assertEquals(HttpStatus.OK, getAllRes.getStatusCode());
        assertFalse(getAllRes.getBody().isEmpty());

        ResponseEntity<UserResponseDTO> getRes = restTemplate.exchange("/admin/users/" + createdId, HttpMethod.GET, new HttpEntity<>(authHeaders(adminToken)), UserResponseDTO.class);
        assertEquals(HttpStatus.OK, getRes.getStatusCode());
        assertEquals(newUsername, getRes.getBody().getUsername());
        assertTrue(getRes.getBody().isEnabled());

        UserUpdateDTO updateDto = new UserUpdateDTO();
        updateDto.setEmail(unique("updated") + "@example.com");
        ResponseEntity<UserResponseDTO> updateRes = restTemplate.exchange("/admin/users/" + createdId, HttpMethod.PUT, new HttpEntity<>(updateDto, authHeaders(adminToken)), UserResponseDTO.class);
        assertEquals(HttpStatus.OK, updateRes.getStatusCode());
        assertEquals(updateDto.getEmail(), updateRes.getBody().getEmail());

        ResponseEntity<UserResponseDTO> toggleRes = restTemplate.exchange("/admin/users/" + createdId + "/status", HttpMethod.PATCH, new HttpEntity<>(authHeaders(adminToken)), UserResponseDTO.class);
        assertEquals(HttpStatus.OK, toggleRes.getStatusCode());
        assertFalse(toggleRes.getBody().isEnabled());

        ResponseEntity<Map> deleteRes = restTemplate.exchange("/admin/users/" + createdId, HttpMethod.DELETE, new HttpEntity<>(authHeaders(adminToken)), Map.class);
        assertEquals(HttpStatus.OK, deleteRes.getStatusCode());

        ResponseEntity<ErrorResponse> notFoundRes = restTemplate.exchange("/admin/users/" + createdId, HttpMethod.GET, new HttpEntity<>(authHeaders(adminToken)), ErrorResponse.class);
        assertEquals(HttpStatus.NOT_FOUND, notFoundRes.getStatusCode());
    }
}
