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
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;


    // =========================================================
    // GET ALL COURSES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }


    // =========================================================
    // GET COURSE BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(
            @PathVariable Integer id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }


    // =========================================================
    // ADD COURSE
    // =========================================================

    @PostMapping
    public ResponseEntity<Course> addCourse(
            @Valid @RequestBody Course course) {
        Course savedCourse = courseService.addCourse(course);
        return new ResponseEntity<>(
                savedCourse,
                HttpStatus.CREATED
        );
    }


    // =========================================================
    // UPDATE COURSE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Integer id,
            @Valid @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(id, course);
        return ResponseEntity.ok(updatedCourse);
    }


    // =========================================================
    // DELETE COURSE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Integer id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}