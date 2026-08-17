package com.example.Hibernate.Controller;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.DTO.StudentStatsDTO;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Service.StudentServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/students", "/api/students"})
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"})
public class StudentController {

    @Autowired
    private StudentServices studentServices;

    @PostMapping
    public ResponseEntity<StudentResponseDTO> addStudent(@Valid @RequestBody StudentRequestDTO studentRequestDTO) {
        StudentResponseDTO response = studentServices.addStudent(studentRequestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/entity")
    public ResponseEntity<StudentResponseDTO> addStudentEntity(@Valid @RequestBody Student student) {
        StudentResponseDTO response = studentServices.saveStudentEntity(student);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String name) {
        String query = search != null ? search : name;
        if (query != null && !query.trim().isEmpty()) {
            return ResponseEntity.ok(studentServices.searchStudents(query));
        }
        return ResponseEntity.ok(studentServices.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Integer id) {
        try {
            StudentResponseDTO student = studentServices.getStudentById(id);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Integer id,
            @Valid @RequestBody StudentRequestDTO studentRequestDTO) {
        try {
            StudentResponseDTO updated = studentServices.updateStudent(id, studentRequestDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping
    public ResponseEntity<StudentResponseDTO> updateStudentBody(@Valid @RequestBody StudentRequestDTO studentRequestDTO, @RequestParam(required = false) Integer id) {
        if (id != null) {
            try {
                StudentResponseDTO updated = studentServices.updateStudent(id, studentRequestDTO);
                return ResponseEntity.ok(updated);
            } catch (RuntimeException e) {
                return ResponseEntity.notFound().build();
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Integer id) {
        try {
            studentServices.deleteStudent(id);
            return ResponseEntity.ok("Student deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
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