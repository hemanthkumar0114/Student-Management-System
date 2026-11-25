package com.example.Hibernate;

import com.example.Hibernate.DTO.ErrorResponse;
import com.example.Hibernate.DTO.UserCreateDTO;
import com.example.Hibernate.DTO.UserResponseDTO;
import com.example.Hibernate.DTO.UserUpdateDTO;
import com.example.Hibernate.Exception.AdminSafetyException;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Service.UserService;
import com.example.Hibernate.Support.ApiTestSupport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AdminUserTests extends ApiTestSupport {

    @Autowired
    private UserService userService;

    private String adminToken;
    private String adminUsername;
    private Long adminUserId;

    @BeforeEach
    void setUp() {
        adminUsername = unique("adm_ctrl");
        com.example.Hibernate.Model.User admin = createTestUser(adminUsername, adminUsername + "@example.com", "pass12345", Role.ADMIN, true);
        adminUserId = admin.getId();
        adminToken = obtainToken(adminUsername, "pass12345");
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

    @Test
    @DisplayName("Admin safety: admin cannot disable or delete own account")
    void adminCannotDisableOrDeleteOwnAccount() {
        ResponseEntity<ErrorResponse> deleteSelfRes = restTemplate.exchange(
                "/admin/users/" + adminUserId,
                HttpMethod.DELETE,
                new HttpEntity<>(authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.CONFLICT, deleteSelfRes.getStatusCode());
        assertTrue(deleteSelfRes.getBody().getMessage().contains("cannot delete their own account"));

        ResponseEntity<ErrorResponse> toggleSelfRes = restTemplate.exchange(
                "/admin/users/" + adminUserId + "/status",
                HttpMethod.PATCH,
                new HttpEntity<>(authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.CONFLICT, toggleSelfRes.getStatusCode());
        assertTrue(toggleSelfRes.getBody().getMessage().contains("cannot disable their own account"));

        UserUpdateDTO updateDto = new UserUpdateDTO();
        updateDto.setEnabled(false);
        ResponseEntity<ErrorResponse> updateSelfRes = restTemplate.exchange(
                "/admin/users/" + adminUserId,
                HttpMethod.PUT,
                new HttpEntity<>(updateDto, authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.CONFLICT, updateSelfRes.getStatusCode());
        assertTrue(updateSelfRes.getBody().getMessage().contains("cannot disable their own account"));
    }

    @Test
    @DisplayName("Admin safety: last remaining admin cannot be disabled, deleted or demoted")
    void lastRemainingAdminSafety() {
        try {
            userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ADMIN && !u.getId().equals(adminUserId))
                    .forEach(u -> userRepository.delete(u));

            assertEquals(1, userRepository.countByRole(Role.ADMIN));

            String otherAdminName = unique("other_adm");
            com.example.Hibernate.Model.User otherAdmin = createTestUser(otherAdminName, otherAdminName + "@example.com", "pass12345", Role.ADMIN, true);
            String otherToken = obtainToken(otherAdminName, "pass12345");

            userRepository.deleteById(adminUserId);
            assertEquals(1, userRepository.countByRole(Role.ADMIN));

            ResponseEntity<ErrorResponse> deleteLastRes = restTemplate.exchange(
                    "/admin/users/" + otherAdmin.getId(),
                    HttpMethod.DELETE,
                    new HttpEntity<>(authHeaders(otherToken)),
                    ErrorResponse.class
            );
            assertEquals(HttpStatus.CONFLICT, deleteLastRes.getStatusCode());

            ResponseEntity<ErrorResponse> toggleLastRes = restTemplate.exchange(
                    "/admin/users/" + otherAdmin.getId() + "/status",
                    HttpMethod.PATCH,
                    new HttpEntity<>(authHeaders(otherToken)),
                    ErrorResponse.class
            );
            assertEquals(HttpStatus.CONFLICT, toggleLastRes.getStatusCode());

            UserUpdateDTO demoteDto = new UserUpdateDTO();
            demoteDto.setRole(Role.USER);
            ResponseEntity<ErrorResponse> demoteLastRes = restTemplate.exchange(
                    "/admin/users/" + otherAdmin.getId(),
                    HttpMethod.PUT,
                    new HttpEntity<>(demoteDto, authHeaders(otherToken)),
                    ErrorResponse.class
            );
            assertEquals(HttpStatus.CONFLICT, demoteLastRes.getStatusCode());
            assertTrue(demoteLastRes.getBody().getMessage().contains("Cannot demote the last remaining administrator account"));
        } finally {
            if (userRepository.findByUsername("admin").isEmpty()) {
                createTestUser("admin", "admin@example.com", "admin123", Role.ADMIN, true);
            }
        }
    }

    @Test
    @DisplayName("Admin safety: admin cannot demote own account even with multiple active admins")
    void adminCannotDemoteOwnAccountWithMultipleAdmins() {
        String otherAdminName = unique("other_adm");
        createTestUser(otherAdminName, otherAdminName + "@example.com", "pass12345", Role.ADMIN, true);

        UserUpdateDTO demoteSelfDto = new UserUpdateDTO();
        demoteSelfDto.setRole(Role.USER);
        ResponseEntity<ErrorResponse> demoteSelfRes = restTemplate.exchange(
                "/admin/users/" + adminUserId,
                HttpMethod.PUT,
                new HttpEntity<>(demoteSelfDto, authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.CONFLICT, demoteSelfRes.getStatusCode());
        assertNotNull(demoteSelfRes.getBody());
        assertTrue(demoteSelfRes.getBody().getMessage().contains("Administrators cannot demote their own account"));
    }

    @Test
    @DisplayName("Admin safety: cannot demote or delete last active admin even if disabled admin accounts exist")
    void lastActiveAdminCannotBeDemotedOrDeletedWithDisabledAdminsPresent() {
        try {
            userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ADMIN && !u.getId().equals(adminUserId))
                    .forEach(u -> userRepository.delete(u));

            String disabledAdminName = unique("dis_adm");
            com.example.Hibernate.Model.User disabledAdmin = createTestUser(disabledAdminName, disabledAdminName + "@example.com", "pass12345", Role.ADMIN, false);

            assertEquals(2, userRepository.countByRole(Role.ADMIN));
            assertEquals(1, userRepository.countByRoleAndEnabled(Role.ADMIN, true));

            UserUpdateDTO demoteDto = new UserUpdateDTO();
            demoteDto.setRole(Role.USER);
            ResponseEntity<ErrorResponse> demoteRes = restTemplate.exchange(
                    "/admin/users/" + adminUserId,
                    HttpMethod.PUT,
                    new HttpEntity<>(demoteDto, authHeaders(adminToken)),
                    ErrorResponse.class
            );
            assertEquals(HttpStatus.CONFLICT, demoteRes.getStatusCode());
            assertNotNull(demoteRes.getBody());
            assertTrue(demoteRes.getBody().getMessage().contains("Cannot demote the last remaining administrator account"));

            ResponseEntity<ErrorResponse> deleteRes = restTemplate.exchange(
                    "/admin/users/" + adminUserId,
                    HttpMethod.DELETE,
                    new HttpEntity<>(authHeaders(adminToken)),
                    ErrorResponse.class
            );
            assertEquals(HttpStatus.CONFLICT, deleteRes.getStatusCode());
            assertNotNull(deleteRes.getBody());

            AdminSafetyException ex = assertThrows(AdminSafetyException.class, () -> userService.deleteUser(adminUserId, disabledAdmin.getUsername()));
            assertTrue(ex.getMessage().contains("Cannot delete the last remaining administrator account"));
        } finally {
            if (userRepository.findByUsername("admin").isEmpty()) {
                createTestUser("admin", "admin@example.com", "admin123", Role.ADMIN, true);
            }
        }
    }

    @Test
    @DisplayName("Normalize username and email (trim, lowercase email)")
    void normalizeUsernameAndEmail() {
        String baseName = unique("norm_user");
        String rawUsername = "  " + baseName + "  ";
        String rawEmail = "  " + baseName + "@EXAMPLE.COM  ";
        UserCreateDTO createDto = new UserCreateDTO(rawUsername, rawEmail, "password123", Role.USER);

        ResponseEntity<UserResponseDTO> createRes = restTemplate.exchange(
                "/admin/users",
                HttpMethod.POST,
                new HttpEntity<>(createDto, authHeaders(adminToken)),
                UserResponseDTO.class
        );
        assertEquals(HttpStatus.CREATED, createRes.getStatusCode());
        assertNotNull(createRes.getBody());
        assertEquals(baseName, createRes.getBody().getUsername());
        assertEquals(baseName.toLowerCase() + "@example.com", createRes.getBody().getEmail());

        UserCreateDTO dupEmailDto = new UserCreateDTO(unique("diff_u"), baseName.toUpperCase() + "@Example.Com", "password123", Role.USER);
        ResponseEntity<ErrorResponse> dupRes = restTemplate.exchange(
                "/admin/users",
                HttpMethod.POST,
                new HttpEntity<>(dupEmailDto, authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.BAD_REQUEST, dupRes.getStatusCode());
        assertTrue(dupRes.getBody().getMessage().contains("Email is already registered"));
    }

    @Test
    @DisplayName("Password rules: 8 to 72 chars on create and update, empty on update leaves unchanged")
    void passwordRulesCreateAndUpdate() {
        String u1 = unique("pwd_u1");
        UserCreateDTO shortPwdDto = new UserCreateDTO(u1, u1 + "@example.com", "short77", Role.USER);
        ResponseEntity<ErrorResponse> shortRes = restTemplate.exchange(
                "/admin/users",
                HttpMethod.POST,
                new HttpEntity<>(shortPwdDto, authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.BAD_REQUEST, shortRes.getStatusCode());

        String longPwd = "A".repeat(73);
        UserCreateDTO longPwdDto = new UserCreateDTO(u1, u1 + "@example.com", longPwd, Role.USER);
        ResponseEntity<ErrorResponse> longRes = restTemplate.exchange(
                "/admin/users",
                HttpMethod.POST,
                new HttpEntity<>(longPwdDto, authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.BAD_REQUEST, longRes.getStatusCode());

        String validPwd = "validPassword123";
        UserCreateDTO validDto = new UserCreateDTO(u1, u1 + "@example.com", validPwd, Role.USER);
        ResponseEntity<UserResponseDTO> createdRes = restTemplate.exchange(
                "/admin/users",
                HttpMethod.POST,
                new HttpEntity<>(validDto, authHeaders(adminToken)),
                UserResponseDTO.class
        );
        assertEquals(HttpStatus.CREATED, createdRes.getStatusCode());
        Long newId = createdRes.getBody().getId();

        UserUpdateDTO shortUpdate = new UserUpdateDTO();
        shortUpdate.setPassword("short");
        ResponseEntity<ErrorResponse> updateShortRes = restTemplate.exchange(
                "/admin/users/" + newId,
                HttpMethod.PUT,
                new HttpEntity<>(shortUpdate, authHeaders(adminToken)),
                ErrorResponse.class
        );
        assertEquals(HttpStatus.BAD_REQUEST, updateShortRes.getStatusCode());

        UserUpdateDTO emptyUpdate = new UserUpdateDTO();
        emptyUpdate.setPassword("");
        emptyUpdate.setUsername(u1 + "_renamed");
        ResponseEntity<UserResponseDTO> updateEmptyRes = restTemplate.exchange(
                "/admin/users/" + newId,
                HttpMethod.PUT,
                new HttpEntity<>(emptyUpdate, authHeaders(adminToken)),
                UserResponseDTO.class
        );
        assertEquals(HttpStatus.OK, updateEmptyRes.getStatusCode());

        String tokenAfterEmptyUpdate = obtainToken(u1 + "_renamed", validPwd);
        assertNotNull(tokenAfterEmptyUpdate);

        UserUpdateDTO newPwdUpdate = new UserUpdateDTO();
        newPwdUpdate.setPassword("brandNewPassword123");
        ResponseEntity<UserResponseDTO> updateNewRes = restTemplate.exchange(
                "/admin/users/" + newId,
                HttpMethod.PUT,
                new HttpEntity<>(newPwdUpdate, authHeaders(adminToken)),
                UserResponseDTO.class
        );
        assertEquals(HttpStatus.OK, updateNewRes.getStatusCode());

        String tokenAfterNewPwd = obtainToken(u1 + "_renamed", "brandNewPassword123");
        assertNotNull(tokenAfterNewPwd);
    }

    @Test
    @DisplayName("Admin API responses do not leak password or password hash")
    void responsesDoNotContainPasswordHash() {
        ResponseEntity<String> getRes = restTemplate.exchange(
                "/admin/users",
                HttpMethod.GET,
                new HttpEntity<>(authHeaders(adminToken)),
                String.class
        );
        assertEquals(HttpStatus.OK, getRes.getStatusCode());
        assertFalse(getRes.getBody().contains("password"));
        assertFalse(getRes.getBody().contains("$2a$"));
    }
}
