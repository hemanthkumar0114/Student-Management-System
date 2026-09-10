package com.example.Hibernate.Service;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.DTO.StudentStatsDTO;
import com.example.Hibernate.Exception.DuplicateResourceException;
import com.example.Hibernate.Exception.ResourceNotFoundException;
import com.example.Hibernate.Model.Address;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Repository.CourseRepository;
import com.example.Hibernate.Repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServicesTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private StudentServices studentServices;

    private Student sampleStudent;
    private Course sampleCourse;

    @BeforeEach
    void setUp() {
        sampleCourse = new Course("Computer Science", "4 Years", "Engineering");
        sampleCourse.setId(1);

        Address address = new Address("Bengaluru", "Karnataka", "560001");
        sampleStudent = new Student(1, "Arjun Sharma", "arjun.sharma@gmail.com", 9.20, address, sampleCourse);
    }

    @Test
    @DisplayName("addStudent - Success")
    void addStudent_Success() {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setName("Arjun Sharma");
        dto.setEmail("arjun.sharma@gmail.com");
        dto.setCgpa(9.20);
        dto.setCity("Bengaluru");
        dto.setState("Karnataka");
        dto.setPincode("560001");
        dto.setCourseid(1);

        when(studentRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        when(courseRepository.findById(1)).thenReturn(Optional.of(sampleCourse));
        when(studentRepository.save(any(Student.class))).thenReturn(sampleStudent);

        StudentResponseDTO response = studentServices.addStudent(dto);

        assertNotNull(response);
        assertEquals("Arjun Sharma", response.getName());
        assertEquals("arjun.sharma@gmail.com", response.getEmail());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("addStudent - Throws DuplicateResourceException when email exists")
    void addStudent_DuplicateEmail_ThrowsException() {
        StudentRequestDTO dto = new StudentRequestDTO();
        dto.setEmail("arjun.sharma@gmail.com");

        when(studentRepository.existsByEmail(dto.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> studentServices.addStudent(dto));
        verify(studentRepository, never()).save(any());
    }

    @Test
    @DisplayName("getStudentById - Success")
    void getStudentById_Success() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(sampleStudent));

        StudentResponseDTO response = studentServices.getStudentById(1);

        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("Arjun Sharma", response.getName());
    }

    @Test
    @DisplayName("getStudentById - Throws ResourceNotFoundException when student not found")
    void getStudentById_NotFound_ThrowsException() {
        when(studentRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentServices.getStudentById(99));
    }

    @Test
    @DisplayName("getAllStudents - Paginated Success")
    void getAllStudents_Paginated_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Student> studentPage = new PageImpl<>(List.of(sampleStudent), pageable, 1);

        when(studentRepository.findAll(pageable)).thenReturn(studentPage);

        Page<StudentResponseDTO> result = studentServices.getAllStudents(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Arjun Sharma", result.getContent().get(0).getName());
    }

    @Test
    @DisplayName("getStats - JPQL Aggregated Stats Calculation Success")
    void getStats_Success() {
        when(studentRepository.count()).thenReturn(20L);
        when(courseRepository.count()).thenReturn(5L);
        when(studentRepository.getAverageCgpa()).thenReturn(8.75);
        when(studentRepository.countByCgpaGreaterThanEqual(8.5)).thenReturn(12L);

        List<Object[]> perCourseCounts = Arrays.asList(
                new Object[]{"Computer Science", 10L},
                new Object[]{"Data Science", 10L}
        );
        when(studentRepository.countStudentsPerCourse()).thenReturn(perCourseCounts);

        StudentStatsDTO stats = studentServices.getStats();

        assertNotNull(stats);
        assertEquals(20L, stats.getTotalStudents());
        assertEquals(5L, stats.getTotalCourses());
        assertEquals(8.75, stats.getAverageCgpa());
        assertEquals(12L, stats.getHonorsStudents());
        assertEquals(2, stats.getStudentsPerCourse().size());
        assertEquals(10L, stats.getStudentsPerCourse().get("Computer Science"));
    }

    @Test
    @DisplayName("deleteStudent - Success")
    void deleteStudent_Success() {
        when(studentRepository.existsById(1)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1);

        assertDoesNotThrow(() -> studentServices.deleteStudent(1));
        verify(studentRepository, times(1)).deleteById(1);
    }

    @Test
    @DisplayName("deleteStudent - Throws ResourceNotFoundException")
    void deleteStudent_NotFound_ThrowsException() {
        when(studentRepository.existsById(99)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> studentServices.deleteStudent(99));
        verify(studentRepository, never()).deleteById(anyInt());
    }
}
