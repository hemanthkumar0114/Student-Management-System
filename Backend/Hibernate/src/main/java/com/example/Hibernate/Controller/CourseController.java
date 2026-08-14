package com.example.Hibernate.Controller;

import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService service;
//    Add Course
    @PostMapping
    public Course saveCourse(@RequestBody Course course){
        return service.saveCourse(course);
    }
//    GetALL Courses
    @GetMapping
    public List<Course> getAllCourses(){
        return service.getAllCourses();
    }
//    GEt Course by ID
    @GetMapping("/{id}")
    public Course getCourse(@PathVariable Integer id){
        return service.getCourseById(id);
    }
//    Update Course
    @PutMapping
    public Course updateCourse(@RequestBody Course course){
        return service.updateCourse(course);
    }
//    Delete course
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Integer id){
        return service.deleteCourse(id);
    }
}
