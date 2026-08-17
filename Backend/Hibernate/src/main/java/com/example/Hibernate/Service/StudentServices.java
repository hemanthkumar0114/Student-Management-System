package com.example.Hibernate.Service;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.DTO.StudentStatsDTO;
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

    public StudentResponseDTO addStudent(StudentRequestDTO dto) {
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

    public StudentResponseDTO saveStudentEntity(Student student) {
        Student saved = studentRepository.save(student);
        return new StudentResponseDTO(saved);
    }

    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<Student> getAllStudentEntities() {
        return studentRepository.findAll();
    }

    public StudentResponseDTO getStudentById(Integer id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return new StudentResponseDTO(student);
    }

    public Student getStudentEntityById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public StudentResponseDTO updateStudent(Integer id, StudentRequestDTO dto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        if (dto.getCgpa() != null) {
            existing.setCgpa(dto.getCgpa());
        }

        if (dto.getCourseid() != null) {
            Course course = courseRepository.findById(dto.getCourseid()).orElse(null);
            existing.setCourse(course);
        }

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

    public void deleteStudent(Integer id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public List<StudentResponseDTO> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim()).stream()
                .map(StudentResponseDTO::new)
                .collect(Collectors.toList());
    }

    public StudentStatsDTO getStats() {
        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        Double avgCgpa = studentRepository.getAverageCgpa();
        double avg = (avgCgpa != null) ? Math.round(avgCgpa * 100.0) / 100.0 : 0.0;

        List<Student> allStudents = studentRepository.findAll();
        long honors = allStudents.stream().filter(s -> s.getCgpa() != null && s.getCgpa() >= 8.5).count();

        Map<String, Long> perCourse = allStudents.stream()
                .filter(s -> s.getCourse() != null && s.getCourse().getCourseName() != null)
                .collect(Collectors.groupingBy(s -> s.getCourse().getCourseName(), Collectors.counting()));

        return new StudentStatsDTO(totalStudents, totalCourses, avg, honors, perCourse);
    }
}
