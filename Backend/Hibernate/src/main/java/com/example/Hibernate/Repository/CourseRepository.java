package com.example.Hibernate.Repository;

import com.example.Hibernate.Model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    boolean existsByCourseName(String courseName);
}