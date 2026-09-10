package com.example.Hibernate.Repository;

import com.example.Hibernate.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    // =========================================================
    // CHECK DUPLICATE EMAIL
    // =========================================================
    boolean existsByEmail(String email);

    // =========================================================
    // SEARCH STUDENTS
    // Searches by name, email, city, course name, or state
    // =========================================================
    @Query("""
            SELECT s
            FROM Student s
            LEFT JOIN s.address a
            LEFT JOIN s.course c
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(a.city) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(a.state) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<Student> searchStudents(@Param("query") String query);

    // =========================================================
    // AVERAGE CGPA
    // =========================================================
    @Query("SELECT AVG(s.cgpa) FROM Student s")
    Double getAverageCgpa();
}