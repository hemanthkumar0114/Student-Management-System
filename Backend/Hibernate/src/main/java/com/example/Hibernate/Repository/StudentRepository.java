package com.example.Hibernate.Repository;

import com.example.Hibernate.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    @Query("SELECT s FROM Student s")
    List<Student> getAllStudents();

    @Query("""

SELECT s

FROM Student s

WHERE s.name=:name

""")
    

    List<Student>

    findStudentByName(

            @Param("name")

            String name);

    // Exact name
    List<Student> findByName(String name);

    // Exact email
    List<Student> findByEmail(String email);

    // Name ignoring case

    List<Student> findByNameIgnoreCase(String name);

    // Name containing keyword
    List<Student> findByNameContaining(String keyword);

    // Name starting with prefix
    List<Student> findByNameStartingWith(String prefix);

    // Email ending with domain
    List<Student> findByEmailEndingWith(String domain);

    // Name AND Email
    List<Student> findByNameAndEmail(
            String name,
            String email
    );

    // Name OR Email
    List<Student> findByNameOrEmail(
            String name,
            String email
    );

    // Search by course name
    List<Student> findByCourseCourseName(String courseName);
}

