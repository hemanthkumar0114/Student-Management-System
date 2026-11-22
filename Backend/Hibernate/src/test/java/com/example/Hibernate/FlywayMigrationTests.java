package com.example.Hibernate;

import com.example.Hibernate.Support.ApiTestSupport;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

class FlywayMigrationTests extends ApiTestSupport {

    @Autowired
    private Flyway flyway;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Verify Flyway Applied V1 Baseline Migration and Tables Exist")
    void flywayMigrationApplied() {
        MigrationInfo[] applied = flyway.info().applied();
        assertTrue(applied.length >= 1);
        assertEquals("1", applied[0].getVersion().getVersion());
        assertEquals("baseline schema", applied[0].getDescription());

        Integer studentCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students", Integer.class);
        assertNotNull(studentCount);

        Integer courseCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM courses", Integer.class);
        assertNotNull(courseCount);

        Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
        assertNotNull(userCount);
    }
}
