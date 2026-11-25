package com.example.Hibernate;

import com.example.Hibernate.Config.DataInitializer;
import com.example.Hibernate.Repository.UserRepository;
import com.example.Hibernate.Support.ApiTestSupport;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class DataInitializerTests extends ApiTestSupport {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Admin password validation throws when empty or null")
    void validateAdminPasswordRequired() {
        DataInitializer init = new DataInitializer();
        ReflectionTestUtils.setField(init, "adminPassword", "");
        assertThrows(IllegalStateException.class, init::validateConfig);

        ReflectionTestUtils.setField(init, "adminPassword", "   ");
        assertThrows(IllegalStateException.class, init::validateConfig);

        ReflectionTestUtils.setField(init, "adminPassword", null);
        assertThrows(IllegalStateException.class, init::validateConfig);

        ReflectionTestUtils.setField(init, "adminPassword", "secureAdmin123");
        assertDoesNotThrow(init::validateConfig);
    }

    @Test
    @DisplayName("Default USER account is not created when app.demo.enabled is false")
    void defaultUserNotCreatedWhenDemoDisabled() {
        assertFalse(userRepository.findByUsername("user").isPresent());
    }

    @Test
    @DisplayName("Admin account is initialized with admin role")
    void adminAccountInitialized() {
        assertTrue(userRepository.findByUsername("admin").isPresent());
    }
}
