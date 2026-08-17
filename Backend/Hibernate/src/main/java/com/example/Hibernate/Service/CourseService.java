package com.example.Hibernate.Service;

import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Integer id) {
        return courseRepository.findById(id);
    }

    public Course updateCourse(Course course) {
        if (course.getId() != null && courseRepository.existsById(course.getId())) {
            return courseRepository.save(course);
        }
        throw new RuntimeException("Course with ID " + course.getId() + " does not exist.");
    }

    public void deleteCourse(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }
}
