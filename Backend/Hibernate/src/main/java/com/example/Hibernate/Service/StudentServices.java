package com.example.Hibernate.Service;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.Model.Address;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.example.Hibernate.Repository.CourseRepository;

import java.util.List;

@Service
public class StudentServices {

    @Autowired
    private StudentRepository repository;
    @Autowired
    private CourseRepository courseRepository;


    // =========================
    // SAVE ONE STUDENT
    // =========================

    public StudentResponseDTO save(StudentRequestDTO dto){

        Student student=new Student();

        student.setName(dto.getName());

        student.setEmail(dto.getEmail());

        Address address=new Address();

        address.setCity(dto.getCity());

        address.setState(dto.getState());

        address.setPincode(dto.getPincode());

        student.setAddress(address);

        Course course = courseRepository.findById(dto.getCourseid()).orElse(null);

        student.setCourse(course);

        Student saved=

                repository.save(student);

        StudentResponseDTO response=

                new StudentResponseDTO();

        response.setId(saved.getId());

        response.setName(saved.getName());

        response.setEmail(saved.getEmail());

        response.setCity(saved.getAddress().getCity());

        response.setCourseName(saved.getCourse().getCourseName());

        return response;

    }


//    ==========================
//    ADD THE NEW METHOD HERE
//    ==========================

    public StudentResponseDTO getStudent(Integer id){
        Student student = repository.findById(id).orElse(null);
        if(student == null){
            return null;
        }
        StudentResponseDTO dto = new StudentResponseDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setCourseName(student.getCourse().getCourseName());
        dto.setCity(student.getAddress().getCity());
        return dto;
    }

    // =========================
    // SAVE MULTIPLE STUDENTS
    // =========================

    public List<Student> saveAllStudents(List<Student> students) {
        return repository.saveAll(students);
    }


    // =========================
    // GET ALL STUDENTS
    // PAGINATION + SORTING
    // =========================

    public Page<Student> getStudents(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return repository.findAll(pageable);
    }


    // =========================
    // GET STUDENT BY ID
    // =========================

    public Student getStudentById(Integer id) {

        return repository.findById(id)
                .orElse(null);
    }


    // =========================
    // UPDATE STUDENT
    // =========================

    public Student updateStudent(Student student) {

        return repository.save(student);
    }


    // =========================
    // DELETE STUDENT
    // =========================

    public String deleteStudent(Integer id) {

        repository.deleteById(id);

        return "Student Deleted Successfully";
    }


    // =========================
    // EXACT NAME SEARCH
    // =========================

    public List<Student> searchName(String name) {

        return repository.findByName(name);
    }


    // =========================
    // EXACT EMAIL SEARCH
    // =========================

    public List<Student> searchEmail(String email) {

        return repository.findByEmail(email);
    }


    // =========================
    // NAME IGNORE CASE
    // =========================

    public List<Student> findByNameIgnorecase(String name) {

        return repository.findByNameIgnoreCase(name);
    }


    // =========================
    // NAME STARTING WITH
    // =========================

    public List<Student> findByNameStringWith(String prefix) {

        return repository.findByNameStartingWith(prefix);
    }


    // =========================
    // NAME CONTAINING
    // =========================

    public List<Student> searchByNameContaining(String keyword) {

        return repository.findByNameContaining(keyword);
    }


    // =========================
    // EMAIL ENDING WITH
    // =========================

    public List<Student> searchByEmailEndingWith(String domain) {

        return repository.findByEmailEndingWith(domain);
    }


    // =========================
    // NAME AND EMAIL
    // =========================

    public List<Student> searchByNameAndEmail(
            String name,
            String email) {

        return repository.findByNameAndEmail(
                name,
                email
        );
    }


    // =========================
    // NAME OR EMAIL
    // =========================

    public List<Student> searchByNameOrEmail(
            String name,
            String email) {

        return repository.findByNameOrEmail(
                name,
                email
        );
    }


    // =========================
    // COURSE NAME
    // =========================

    public List<Student> searchByCourseName(
            String courseName) {

        return repository.findByCourseCourseName(
                courseName
        );
    }

    public List<Student> getAllStudentsJPQL(){

        return repository.getAllStudents();

    }

    public List<Student>

    searchJPQL(String name){

        return repository.findStudentByName(name);

    }
}
