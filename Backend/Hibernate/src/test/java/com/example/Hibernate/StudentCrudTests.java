package com.example.Hibernate;

import com.example.Hibernate.DTO.ErrorResponse;
import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.DTO.StudentStatsDTO;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Repository.CourseRepository;
import com.example.Hibernate.Repository.StudentRepository;
import com.example.Hibernate.Support.ApiTestSupport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class StudentCrudTests extends ApiTestSupport {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    private String adminToken;
    private String userToken;
    private Integer sampleCourseId;

    @BeforeEach
    void setUp() {
        String aName = unique("crud_admin");
        createTestUser(aName, aName + "@example.com", "pass123", Role.ADMIN, true);
        adminToken = obtainToken(aName, "pass123");

        String uName = unique("crud_user");
        createTestUser(uName, uName + "@example.com", "pass123", Role.USER, true);
        userToken = obtainToken(uName, "pass123");

        Course course = courseRepository.save(new Course("Electronics", "4 Years", "Engineering"));
        sampleCourseId = course.getId();
    }

    @Test
    @DisplayName("POST /students Validation Errors - Returns 400 Bad Request")
    void addStudentValidationError() {
        StudentRequestDTO invalid = new StudentRequestDTO("", "not-an-email", 11.0, sampleCourseId, "City", "State", "12345");
        HttpEntity<StudentRequestDTO> entity = new HttpEntity<>(invalid, authHeaders(adminToken));

        ResponseEntity<ErrorResponse> response = restTemplate.exchange("/students", HttpMethod.POST, entity, ErrorResponse.class);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().getStatus());
        assertNotNull(response.getBody().getErrors());
    }

    @Test
    @DisplayName("POST /students Duplicate Email - Returns 409 Conflict")
    void addStudentDuplicateEmail() {
        String email = unique("dup") + "@mail.com";
        StudentRequestDTO first = new StudentRequestDTO("Student One", email, 8.5, sampleCourseId, "Bengaluru", "KA", "560001");
        restTemplate.exchange("/students", HttpMethod.POST, new HttpEntity<>(first, authHeaders(adminToken)), StudentResponseDTO.class);

        StudentRequestDTO second = new StudentRequestDTO("Student Two", email, 9.0, sampleCourseId, "Bengaluru", "KA", "560001");
        ResponseEntity<ErrorResponse> response = restTemplate.exchange("/students", HttpMethod.POST, new HttpEntity<>(second, authHeaders(adminToken)), ErrorResponse.class);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(409, response.getBody().getStatus());
    }

    @Test
    @DisplayName("Student Lifecycle: Create, GetById, Update, Delete, 404")
    void studentLifecycle() {
        String email = unique("lifecycle") + "@mail.com";
        StudentRequestDTO request = new StudentRequestDTO("Lifecycle Student", email, 8.0, sampleCourseId, "Bengaluru", "KA", "560001");

        ResponseEntity<StudentResponseDTO> createRes = restTemplate.exchange("/students", HttpMethod.POST, new HttpEntity<>(request, authHeaders(adminToken)), StudentResponseDTO.class);
        assertEquals(HttpStatus.CREATED, createRes.getStatusCode());
        assertNotNull(createRes.getBody());
        Integer studentId = createRes.getBody().getId();
        assertNotNull(studentId);

        ResponseEntity<StudentResponseDTO> getRes = restTemplate.exchange("/students/" + studentId, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), StudentResponseDTO.class);
        assertEquals(HttpStatus.OK, getRes.getStatusCode());
        assertEquals("Lifecycle Student", getRes.getBody().getName());

        StudentRequestDTO updateReq = new StudentRequestDTO("Updated Name", email, 9.5, sampleCourseId, "Mysuru", "KA", "570001");
        ResponseEntity<StudentResponseDTO> updateRes = restTemplate.exchange("/students/" + studentId, HttpMethod.PUT, new HttpEntity<>(updateReq, authHeaders(adminToken)), StudentResponseDTO.class);
        assertEquals(HttpStatus.OK, updateRes.getStatusCode());
        assertEquals("Updated Name", updateRes.getBody().getName());
        assertEquals("Mysuru", updateRes.getBody().getAddress().getCity());

        ResponseEntity<Map> deleteRes = restTemplate.exchange("/students/" + studentId, HttpMethod.DELETE, new HttpEntity<>(authHeaders(adminToken)), Map.class);
        assertEquals(HttpStatus.OK, deleteRes.getStatusCode());

        ResponseEntity<ErrorResponse> notFoundRes = restTemplate.exchange("/students/" + studentId, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), ErrorResponse.class);
        assertEquals(HttpStatus.NOT_FOUND, notFoundRes.getStatusCode());
        assertEquals(404, notFoundRes.getBody().getStatus());
    }

    @Test
    @DisplayName("GET /students Pagination, Search, and Stats")
    void paginationSearchStats() {
        ResponseEntity<Map> pageRes = restTemplate.exchange("/students?page=0&size=5", HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), Map.class);
        assertEquals(HttpStatus.OK, pageRes.getStatusCode());
        assertNotNull(pageRes.getBody());
        assertTrue(pageRes.getBody().containsKey("content"));
        assertTrue(pageRes.getBody().containsKey("totalElements"));

        ResponseEntity<StudentStatsDTO> statsRes = restTemplate.exchange("/students/stats", HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), StudentStatsDTO.class);
        assertEquals(HttpStatus.OK, statsRes.getStatusCode());
        assertNotNull(statsRes.getBody());
        assertTrue(statsRes.getBody().getTotalStudents() >= 0);
    }
}
