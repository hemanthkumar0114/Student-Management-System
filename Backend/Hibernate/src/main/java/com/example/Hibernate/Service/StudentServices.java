package com.example.Hibernate.Service;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.DTO.StudentStatsDTO;
import com.example.Hibernate.Exception.DuplicateResourceException;
import com.example.Hibernate.Exception.ResourceNotFoundException;
import com.example.Hibernate.Model.Address;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Repository.AddressRepository;
import com.example.Hibernate.Repository.CourseRepository;
import com.example.Hibernate.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServices {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AddressRepository addressRepository;


    // =========================================================
    // ADD STUDENT
    // =========================================================

    public StudentResponseDTO addStudent(StudentRequestDTO dto) {

        // Check duplicate email before saving
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException(
                    "Student with email '" + dto.getEmail() + "' already exists"
            );
        }

        Course course = null;

        if (dto.getCourseid() != null) {
            course = courseRepository.findById(dto.getCourseid())
                    .orElse(null);
        }

        Address address = new Address();
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());

        Student student = new Student();

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setCgpa(dto.getCgpa() != null ? dto.getCgpa() : 8.0);
        student.setAddress(address);
        student.setCourse(course);

        Student saved = studentRepository.save(student);

        return new StudentResponseDTO(saved);
    }


    // =========================================================
    // SAVE STUDENT ENTITY
    // =========================================================

    public StudentResponseDTO saveStudentEntity(Student student) {

        // Check duplicate email when saving directly
        if (student.getEmail() != null &&
                studentRepository.existsByEmail(student.getEmail())) {

            throw new DuplicateResourceException(
                    "Student with email '" + student.getEmail() + "' already exists"
            );
        }

        Student saved = studentRepository.save(student);

        return new StudentResponseDTO(saved);
    }


    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    public List<StudentResponseDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET ALL STUDENT ENTITIES
    // =========================================================

    public List<Student> getAllStudentEntities() {

        return studentRepository.findAll();
    }


    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    public StudentResponseDTO getStudentById(Integer id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        return new StudentResponseDTO(student);
    }


    // =========================================================
    // GET STUDENT ENTITY BY ID
    // =========================================================

    public Student getStudentEntityById(Integer id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );
    }


    // =========================================================
    // UPDATE STUDENT
    // =========================================================

    public StudentResponseDTO updateStudent(
            Integer id,
            StudentRequestDTO dto) {

        Student existing = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );


        // Check if email is being changed to another student's email
        if (dto.getEmail() != null &&
                !dto.getEmail().equalsIgnoreCase(existing.getEmail()) &&
                studentRepository.existsByEmail(dto.getEmail())) {

            throw new DuplicateResourceException(
                    "Student with email '" + dto.getEmail() + "' already exists"
            );
        }


        // Update basic student details
        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());


        // Update CGPA
        if (dto.getCgpa() != null) {
            existing.setCgpa(dto.getCgpa());
        }


        // Update course
        if (dto.getCourseid() != null) {

            Course course = courseRepository.findById(dto.getCourseid())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Course not found with id: "
                                            + dto.getCourseid()
                            )
                    );

            existing.setCourse(course);
        }


        // Update address
        Address address = existing.getAddress();

        if (address == null) {
            address = new Address();
        }

        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());

        existing.setAddress(address);


        Student updated = studentRepository.save(existing);

        return new StudentResponseDTO(updated);
    }


    // =========================================================
    // DELETE STUDENT
    // =========================================================

    public void deleteStudent(Integer id) {

        if (!studentRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Student not found with id: " + id
            );
        }

        studentRepository.deleteById(id);
    }


    // =========================================================
    // SEARCH STUDENTS
    // =========================================================

    public List<StudentResponseDTO> searchStudents(String query) {

        if (query == null || query.trim().isEmpty()) {

            return getAllStudents();
        }

        return studentRepository
                .searchStudents(query.trim())
                .stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }


    // =========================================================
    // STUDENT STATISTICS
    // =========================================================

    public StudentStatsDTO getStats() {

        long totalStudents = studentRepository.count();

        long totalCourses = courseRepository.count();

        Double avgCgpa = studentRepository.getAverageCgpa();

        double avg = (avgCgpa != null)
                ? Math.round(avgCgpa * 100.0) / 100.0
                : 0.0;


        // Students with CGPA >= 8.5
        List<Student> allStudents = studentRepository.findAll();

        long honors = allStudents
                .stream()
                .filter(s ->
                        s.getCgpa() != null &&
                                s.getCgpa() >= 8.5
                )
                .count();


        // Students per course
        Map<String, Long> perCourse = allStudents
                .stream()
                .filter(s ->
                        s.getCourse() != null &&
                                s.getCourse().getCourseName() != null
                )
                .collect(
                        Collectors.groupingBy(
                                s -> s.getCourse().getCourseName(),
                                Collectors.counting()
                        )
                );


        return new StudentStatsDTO(
                totalStudents,
                totalCourses,
                avg,
                honors,
                perCourse
        );
    }
}