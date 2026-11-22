package com.example.Hibernate.Controller;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.DTO.StudentStatsDTO;
import com.example.Hibernate.Service.StudentServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/students", "/api/students"})
public class StudentController {

    @Autowired
    private StudentServices studentServices;

    @PostMapping
    public ResponseEntity<StudentResponseDTO> addStudent(@Valid @RequestBody StudentRequestDTO studentRequestDTO) {
        StudentResponseDTO response = studentServices.addStudent(studentRequestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<StudentResponseDTO>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String name,
            @PageableDefault(page = 0, size = 20, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            pageable = PageRequest.of(pageable.getPageNumber(), 100, pageable.getSort());
        }
        String query = search != null ? search : name;
        if (query != null && !query.trim().isEmpty()) {
            return ResponseEntity.ok(studentServices.searchStudents(query, pageable));
        }
        return ResponseEntity.ok(studentServices.getAllStudents(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Integer id) {
        StudentResponseDTO student = studentServices.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Integer id,
            @Valid @RequestBody StudentRequestDTO studentRequestDTO) {
        StudentResponseDTO updated = studentServices.updateStudent(id, studentRequestDTO);
        return ResponseEntity.ok(updated);
    }

    @PutMapping
    public ResponseEntity<StudentResponseDTO> updateStudentBody(
            @Valid @RequestBody StudentRequestDTO studentRequestDTO,
            @RequestParam(required = false) Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID parameter is required for update");
        }
        StudentResponseDTO updated = studentServices.updateStudent(id, studentRequestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Integer id) {
        studentServices.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully with ID: " + id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponseDTO>> searchStudents(@RequestParam("query") String query) {
        return ResponseEntity.ok(studentServices.searchStudents(query));
    }

    @GetMapping("/stats")
    public ResponseEntity<StudentStatsDTO> getStats() {
        return ResponseEntity.ok(studentServices.getStats());
    }
}
