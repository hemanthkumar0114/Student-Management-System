package com.example.Hibernate.Repository;

import com.example.Hibernate.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    Optional<Student> findByEmail(String email);

    List<Student> findByNameContainingIgnoreCase(String name);

    List<Student> findByCourseId(Integer courseId);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.course.courseName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.address.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchStudents(@Param("query") String query);

    @Query("SELECT AVG(s.cgpa) FROM Student s")
    Double getAverageCgpa();
}
