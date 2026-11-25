package com.example.Hibernate;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.UserCreateDTO;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Model.Student;
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

import static org.junit.jupiter.api.Assertions.assertEquals;

class RoleAccessMatrixTests extends ApiTestSupport {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    private String userToken;
    private String adminToken;
    private Integer sampleCourseId;
    private Integer sampleStudentId;

    @BeforeEach
    void setUp() {
        String uName = unique("matrix_u");
        createTestUser(uName, uName + "@example.com", "pass123", Role.USER, true);
        userToken = obtainToken(uName, "pass123");

        String aName = unique("matrix_a");
        createTestUser(aName, aName + "@example.com", "pass123", Role.ADMIN, true);
        adminToken = obtainToken(aName, "pass123");

        Course course = courseRepository.save(new Course("Computer Science", "4 Years", "Engineering"));
        sampleCourseId = course.getId();

        Student student = studentRepository.save(new Student("Test Student", unique("student") + "@example.com", 9.0, null, course));
        sampleStudentId = student.getId();
    }

    @Test
    @DisplayName("Public Endpoints accessible without authentication")
    void publicEndpoints() {
        ResponseEntity<String> health = restTemplate.getForEntity("/actuator/health", String.class);
        assertEquals(HttpStatus.OK, health.getStatusCode());
    }

    @Test
    @DisplayName("GET /students and /api/students role matrix")
    void getStudentsRoleMatrix() {
        for (String prefix : new String[]{"/students", "/api/students"}) {
            ResponseEntity<String> anon = restTemplate.getForEntity(prefix, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.OK, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix, HttpMethod.GET, new HttpEntity<>(authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.OK, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("POST /students and /api/students role matrix")
    void postStudentsRoleMatrix() {
        for (String prefix : new String[]{"/students", "/api/students"}) {
            StudentRequestDTO dto = new StudentRequestDTO("New Student", unique("s") + "@mail.com", 8.5, sampleCourseId, "Bengaluru", "KA", "560001");

            ResponseEntity<String> anon = restTemplate.postForEntity(prefix, dto, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix, HttpMethod.POST, new HttpEntity<>(dto, authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix, HttpMethod.POST, new HttpEntity<>(dto, authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.CREATED, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("GET /courses and /api/courses role matrix")
    void getCoursesRoleMatrix() {
        for (String prefix : new String[]{"/courses", "/api/courses"}) {
            ResponseEntity<String> anon = restTemplate.getForEntity(prefix, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.OK, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix, HttpMethod.GET, new HttpEntity<>(authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.OK, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("POST /courses and /api/courses role matrix")
    void postCoursesRoleMatrix() {
        for (String prefix : new String[]{"/courses", "/api/courses"}) {
            Course course = new Course(unique("Tech"), "6 Months", "IT");

            ResponseEntity<String> anon = restTemplate.postForEntity(prefix, course, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix, HttpMethod.POST, new HttpEntity<>(course, authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix, HttpMethod.POST, new HttpEntity<>(course, authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.CREATED, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("Admin Users endpoint role matrix (/admin/users and /api/admin/users)")
    void adminUsersRoleMatrix() {
        for (String prefix : new String[]{"/admin/users", "/api/admin/users"}) {
            ResponseEntity<String> anon = restTemplate.getForEntity(prefix, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix, HttpMethod.GET, new HttpEntity<>(authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix, HttpMethod.GET, new HttpEntity<>(authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.OK, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("PUT /students and /api/students role matrix")
    void putStudentsRoleMatrix() {
        for (String prefix : new String[]{"/students", "/api/students"}) {
            Student student = studentRepository.save(new Student("Student For Put", unique("s_put") + "@mail.com", 8.0, null, courseRepository.findById(sampleCourseId).orElse(null)));
            StudentRequestDTO updateDto = new StudentRequestDTO("Updated Student", unique("s_upd") + "@mail.com", 8.5, sampleCourseId, "City", "ST", "123456");

            ResponseEntity<String> anon = restTemplate.exchange(prefix + "/" + student.getId(), HttpMethod.PUT, new HttpEntity<>(updateDto), String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix + "/" + student.getId(), HttpMethod.PUT, new HttpEntity<>(updateDto, authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix + "/" + student.getId(), HttpMethod.PUT, new HttpEntity<>(updateDto, authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.OK, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("DELETE /students and /api/students role matrix")
    void deleteStudentsRoleMatrix() {
        for (String prefix : new String[]{"/students", "/api/students"}) {
            Student student = studentRepository.save(new Student("Student For Del", unique("s_del") + "@mail.com", 8.0, null, courseRepository.findById(sampleCourseId).orElse(null)));

            ResponseEntity<String> anon = restTemplate.exchange(prefix + "/" + student.getId(), HttpMethod.DELETE, null, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix + "/" + student.getId(), HttpMethod.DELETE, new HttpEntity<>(authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix + "/" + student.getId(), HttpMethod.DELETE, new HttpEntity<>(authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.OK, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("PUT /courses and /api/courses role matrix")
    void putCoursesRoleMatrix() {
        for (String prefix : new String[]{"/courses", "/api/courses"}) {
            Course course = courseRepository.save(new Course(unique("PutCourse"), "3 Months", "IT"));
            Course updateDto = new Course("Updated " + course.getCourseName(), "5 Months", "IT");

            ResponseEntity<String> anon = restTemplate.exchange(prefix + "/" + course.getId(), HttpMethod.PUT, new HttpEntity<>(updateDto), String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix + "/" + course.getId(), HttpMethod.PUT, new HttpEntity<>(updateDto, authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix + "/" + course.getId(), HttpMethod.PUT, new HttpEntity<>(updateDto, authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.OK, admin.getStatusCode());
        }
    }

    @Test
    @DisplayName("DELETE /courses and /api/courses role matrix")
    void deleteCoursesRoleMatrix() {
        for (String prefix : new String[]{"/courses", "/api/courses"}) {
            Course course = courseRepository.save(new Course(unique("DelCourse"), "3 Months", "IT"));

            ResponseEntity<String> anon = restTemplate.exchange(prefix + "/" + course.getId(), HttpMethod.DELETE, null, String.class);
            assertEquals(HttpStatus.UNAUTHORIZED, anon.getStatusCode());

            ResponseEntity<String> user = restTemplate.exchange(prefix + "/" + course.getId(), HttpMethod.DELETE, new HttpEntity<>(authHeaders(userToken)), String.class);
            assertEquals(HttpStatus.FORBIDDEN, user.getStatusCode());

            ResponseEntity<String> admin = restTemplate.exchange(prefix + "/" + course.getId(), HttpMethod.DELETE, new HttpEntity<>(authHeaders(adminToken)), String.class);
            assertEquals(HttpStatus.NO_CONTENT, admin.getStatusCode());
        }
    }
}
