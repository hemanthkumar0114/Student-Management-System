package com.example.Hibernate.Service;


import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repository;

    //    Save Course
    public Course saveCourse(Course course) {
        return repository.save(course);
    }

    //    Get All Courses
    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    //    GEtCourse by Id
    public Course getCourseById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    //    Update Course
    public Course updateCourse(Course course) {
    return repository.save(course);
    }
    public String deleteCourse(Integer id){
        repository.deleteById(id);
        return "Course Deleted Successfully";
    }

}
