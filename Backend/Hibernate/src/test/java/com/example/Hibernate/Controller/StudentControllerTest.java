package com.example.Hibernate.Controller;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.Model.Address;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Security.CustomUserDetailsService;
import com.example.Hibernate.Security.JwtTokenProvider;
import com.example.Hibernate.Service.StudentServices;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.Hibernate.Security.SecurityConfig;
import com.example.Hibernate.Exception.GlobalExceptionHandler;
import org.springframework.context.annotation.Import;

@WebMvcTest(StudentController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentServices studentServices;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private StudentResponseDTO sampleResponse;

    @BeforeEach
    void setUp() {
        Course course = new Course(1, "Computer Science", "4 Years");
        Address address = new Address("Bengaluru", "Karnataka", "560001");
        Student student = new Student(1, "Arjun Sharma", "arjun.sharma@gmail.com", 9.20, address, course);
        sampleResponse = new StudentResponseDTO(student);
    }

    @Test
    @DisplayName("GET /students - Authenticated USER - Returns 200 and Paginated List")
    @WithMockUser(roles = "USER")
    void getAllStudents_WithUserRole_Returns200() throws Exception {
        Page<StudentResponseDTO> page = new PageImpl<>(List.of(sampleResponse));
        when(studentServices.getAllStudents(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Arjun Sharma"))
                .andExpect(jsonPath("$.content[0].email").value("arjun.sharma@gmail.com"));
    }

    @Test
    @DisplayName("POST /students - ADMIN Role Valid DTO - Returns 201 Created")
    @WithMockUser(roles = "ADMIN")
    void addStudent_ValidDTO_AdminRole_Returns201() throws Exception {
        StudentRequestDTO requestDTO = new StudentRequestDTO();
        requestDTO.setName("Arjun Sharma");
        requestDTO.setEmail("arjun.sharma@gmail.com");
        requestDTO.setCgpa(9.20);
        requestDTO.setCity("Bengaluru");
        requestDTO.setState("Karnataka");
        requestDTO.setPincode("560001");

        when(studentServices.addStudent(any(StudentRequestDTO.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/students")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Arjun Sharma"))
                .andExpect(jsonPath("$.email").value("arjun.sharma@gmail.com"));
    }

    @Test
    @DisplayName("POST /students - Invalid DTO - Returns 400 Bad Request with Validation Error Structure")
    @WithMockUser(roles = "ADMIN")
    void addStudent_InvalidDTO_Returns400() throws Exception {
        StudentRequestDTO invalidDTO = new StudentRequestDTO();
        invalidDTO.setName(""); // Invalid name
        invalidDTO.setEmail("invalid-email-format"); // Invalid email

        mockMvc.perform(post("/students")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation Failed"))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    @DisplayName("POST /students - USER Role (Insufficient Permissions) - Returns 403 Forbidden")
    @WithMockUser(roles = "USER")
    void addStudent_WithUserRole_Returns403() throws Exception {
        StudentRequestDTO requestDTO = new StudentRequestDTO();
        requestDTO.setName("Arjun Sharma");
        requestDTO.setEmail("arjun.sharma@gmail.com");

        mockMvc.perform(post("/students")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /students/{id} - ADMIN Role - Returns 200 OK")
    @WithMockUser(roles = "ADMIN")
    void deleteStudent_WithAdminRole_Returns200() throws Exception {
        mockMvc.perform(delete("/students/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Student deleted successfully with ID: 1"));
    }
}
