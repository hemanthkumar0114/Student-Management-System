package com.example.Hibernate.Controller;

import com.example.Hibernate.DTO.StudentRequestDTO;
import com.example.Hibernate.DTO.StudentResponseDTO;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Service.StudentServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:5176")
public class StudentController {

    @Autowired
    private StudentServices service;


    // =========================
    // SAVE ONE STUDENT
    // =========================

    @PostMapping
    public StudentResponseDTO save
            (@Valid @RequestBody StudentRequestDTO dto)
    {
        return service.save(dto);
    }


    // =========================
    // SAVE MULTIPLE STUDENTS
    // =========================

    @PostMapping("/bulk")
    public List<Student> saveMultipleStudents(
            @Valid @RequestBody List<@Valid Student> students) {

        return service.saveAllStudents(students);
    }


    // =========================
    // GET ALL STUDENTS
    // PAGINATION + SORTING
    // =========================

    @GetMapping
    public Page<Student> getStudents(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        return service.getStudents(
                page,
                size,
                sortBy,
                direction
        );
    }


    // =========================
    // GET STUDENT BY ID
    // =========================

   @GetMapping("/{id}")
   public StudentResponseDTO getStudent(@PathVariable Integer id){
        return service.getStudent(id);
   }

    // =========================
    // UPDATE STUDENT
    // =========================

    @PutMapping
    public Student updateStudent(
            @RequestBody Student student) {

        return service.updateStudent(student);
    }


    // =========================
    // DELETE STUDENT
    // =========================

    @DeleteMapping("/{id}")
    public String deleteStudent(
            @PathVariable Integer id) {

        return service.deleteStudent(id);
    }


    // =========================
    // EXACT NAME
    // =========================

    @GetMapping("/search")
    public List<Student> searchStudent(
            @RequestParam String name) {

        return service.searchName(name);
    }


    // =========================
    // EXACT EMAIL
    // =========================

    @GetMapping("/email")
    public List<Student> searchEmail(
            @RequestParam String email) {

        return service.searchEmail(email);
    }


    // =========================
    // NAME IGNORE CASE
    // =========================

    @GetMapping("/ignore-case")
    public List<Student> findByNameIgnoreCase(
            @RequestParam String name) {

        return service.findByNameIgnorecase(name);
    }


    // =========================
    // NAME STARTING WITH
    // =========================

    @GetMapping("/starts-with")
    public List<Student> findByNameStartingWith(
            @RequestParam String prefix) {

        return service.findByNameStringWith(prefix);
    }


    // =========================
    // NAME CONTAINING
    // =========================

    @GetMapping("/search/name")
    public List<Student> searchByNameContaining(
            @RequestParam String keyword) {

        return service.searchByNameContaining(keyword);
    }


    // =========================
    // EMAIL ENDING WITH
    // =========================

    @GetMapping("/search/email")
    public List<Student> searchByEmailEndingWith(
            @RequestParam String domain) {

        return service.searchByEmailEndingWith(domain);
    }


    // =========================
    // NAME AND EMAIL
    // =========================

    @GetMapping("/search/name-email")
    public List<Student> searchByNameAndEmail(
            @RequestParam String name,
            @RequestParam String email) {

        return service.searchByNameAndEmail(
                name,
                email
        );
    }


    // =========================
    // NAME OR EMAIL
    // =========================

    @GetMapping("/search/name-or-email")
    public List<Student> searchByNameOrEmail(
            @RequestParam String name,
            @RequestParam String email) {

        return service.searchByNameOrEmail(
                name,
                email
        );
    }


    // =========================
    // COURSE NAME
    // =========================

    @GetMapping("/search/course")
    public List<Student> searchByCourseName(
            @RequestParam String courseName) {

        return service.searchByCourseName(
                courseName
        );
    }
    @GetMapping("/jpql")

    public List<Student>

    getStudentsJPQL(){

        return service.getAllStudentsJPQL();

    }
    @GetMapping("/jpql/name")

    public List<Student>

    search(

            @RequestParam String name){

        return service.searchJPQL(name);

    }

}