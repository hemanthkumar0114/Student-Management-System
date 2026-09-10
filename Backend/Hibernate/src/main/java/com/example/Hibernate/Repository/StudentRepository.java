package com.example.Hibernate.Repository;

import com.example.Hibernate.Model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    // SEARCH STUDENTS (UNPAGINATED & PAGINATED)
    // =========================================================
    @Query("""
            SELECT s
            FROM Student s
            LEFT JOIN s.course c
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.address.city) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.address.state) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<Student> searchStudents(@Param("query") String query);

    @Query("""
            SELECT s
            FROM Student s
            LEFT JOIN s.course c
            WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.address.city) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.address.state) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    Page<Student> searchStudents(@Param("query") String query, Pageable pageable);

    // =========================================================
    // AVERAGE CGPA
    // =========================================================
    @Query("SELECT AVG(s.cgpa) FROM Student s")
    Double getAverageCgpa();

    // =========================================================
    // HONORS COUNT (CGPA >= MIN)
    // =========================================================
    @Query("SELECT COUNT(s) FROM Student s WHERE s.cgpa >= :cgpa")
    long countByCgpaGreaterThanEqual(@Param("cgpa") Double cgpa);

    // =========================================================
    // STUDENTS PER COURSE AGGREGATION
    // =========================================================
    @Query("SELECT s.course.courseName, COUNT(s) FROM Student s WHERE s.course IS NOT NULL GROUP BY s.course.courseName")
    List<Object[]> countStudentsPerCourse();
}