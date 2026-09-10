package com.example.Hibernate.Service;

import com.example.Hibernate.Exception.DuplicateResourceException;
import com.example.Hibernate.Exception.ResourceNotFoundException;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;


    // =========================================================
    // ADD COURSE
    // =========================================================

    public Course addCourse(Course course) {

        if (course == null) {
            throw new IllegalArgumentException("Course data cannot be null");
        }

        if (course.getCourseName() == null ||
                course.getCourseName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Course name cannot be empty"
            );
        }

        String courseName = course.getCourseName().trim();

        if (courseRepository.existsByCourseName(courseName)) {

            throw new DuplicateResourceException(
                    "Course with name '" + courseName + "' already exists"
            );
        }

        course.setCourseName(courseName);

        return courseRepository.save(course);
    }


    // =========================================================
    // GET ALL COURSES
    // =========================================================

    public List<Course> getAllCourses() {

        return courseRepository.findAll();
    }


    // =========================================================
    // GET COURSE BY ID
    // =========================================================

    public Course getCourseById(Integer id) {

        return courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );
    }


    // =========================================================
    // UPDATE COURSE
    // =========================================================

    public Course updateCourse(Integer id, Course updatedCourse) {

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );


        if (updatedCourse == null) {

            throw new IllegalArgumentException(
                    "Course data cannot be null"
            );
        }


        if (updatedCourse.getCourseName() == null ||
                updatedCourse.getCourseName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Course name cannot be empty"
            );
        }


        String newCourseName =
                updatedCourse.getCourseName().trim();


        // Check duplicate course name
        if (!newCourseName.equalsIgnoreCase(
                existingCourse.getCourseName())) {

            if (courseRepository.existsByCourseName(newCourseName)) {

                throw new DuplicateResourceException(
                        "Course with name '" +
                                newCourseName +
                                "' already exists"
                );
            }
        }


        existingCourse.setCourseName(newCourseName);

        existingCourse.setDuration(
                updatedCourse.getDuration()
        );

        existingCourse.setDepartment(
                updatedCourse.getDepartment()
        );


        return courseRepository.save(existingCourse);
    }


    // =========================================================
    // DELETE COURSE
    // =========================================================

    public void deleteCourse(Integer id) {

        if (!courseRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Course not found with id: " + id
            );
        }

        courseRepository.deleteById(id);
    }
}