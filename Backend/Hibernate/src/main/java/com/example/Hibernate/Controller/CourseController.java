package com.example.Hibernate.Controller;

import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/courses", "/api/courses"})
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"})
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<Course> addCourse(@Valid @RequestBody Course course) {
        Course savedCourse = courseService.addCourse(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Integer id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<Course> updateCourseBody(@Valid @RequestBody Course course) {
        try {
            Course updatedCourse = courseService.updateCourse(course);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCoursePath(@PathVariable Integer id, @Valid @RequestBody Course course) {
        course.setId(id);
        try {
            Course updatedCourse = courseService.updateCourse(course);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Integer id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Course deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
