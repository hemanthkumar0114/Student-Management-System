package com.example.Hibernate;

import com.example.Hibernate.DTO.ErrorResponse;
import com.example.Hibernate.Model.Course;
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

import static org.junit.jupiter.api.Assertions.*;

class CourseTests extends ApiTestSupport {

    private String adminToken;
    private String userToken;

    @BeforeEach
    void setUp() {
        String aName = unique("course_admin");
        createTestUser(aName, aName + "@example.com", "pass123", Role.ADMIN, true);
        adminToken = obtainToken(aName, "pass123");

        String uName = unique("course_user");
        createTestUser(uName, uName + "@example.com", "pass123", Role.USER, true);
        userToken = obtainToken(uName, "pass123");
    }

    @Test
    @DisplayName("Course Lifecycle: Create, GetAll, GetById, Update, Delete, 404")
    void courseLifecycle() {
        Course newCourse = new Course(unique("CourseName"), "6 Months", "Cloud");
        ResponseEntity<Course> createRes = restTemplate.exchange("/courses", HttpMethod.POST, new HttpEntity<>(newCourse, authHeaders(adminToken)), Course.class);
        assertEquals(HttpStatus.CREATED, createRes.getStatusCode());
        assertNotNull(createRes.getBody());
        Integer courseId = createRes.getBody().getId();
        assertNotNull(courseId);

        ResponseEntity<List> getAllRes = restTemplate.exchange("/courses", HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), List.class);
        assertEquals(HttpStatus.OK, getAllRes.getStatusCode());
        assertFalse(getAllRes.getBody().isEmpty());

        ResponseEntity<Course> getRes = restTemplate.exchange("/courses/" + courseId, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), Course.class);
        assertEquals(HttpStatus.OK, getRes.getStatusCode());

        newCourse.setCourseName(unique("CourseUpdated"));
        ResponseEntity<Course> updateRes = restTemplate.exchange("/courses/" + courseId, HttpMethod.PUT, new HttpEntity<>(newCourse, authHeaders(adminToken)), Course.class);
        assertEquals(HttpStatus.OK, updateRes.getStatusCode());

        ResponseEntity<Void> deleteRes = restTemplate.exchange("/courses/" + courseId, HttpMethod.DELETE, new HttpEntity<>(authHeaders(adminToken)), Void.class);
        assertEquals(HttpStatus.NO_CONTENT, deleteRes.getStatusCode());

        ResponseEntity<ErrorResponse> notFoundRes = restTemplate.exchange("/courses/" + courseId, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), ErrorResponse.class);
        assertEquals(HttpStatus.NOT_FOUND, notFoundRes.getStatusCode());
    }
}
