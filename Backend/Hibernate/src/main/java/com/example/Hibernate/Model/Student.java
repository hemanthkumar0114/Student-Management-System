package com.example.Hibernate.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Student name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must contain between 2 and 100 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Enter a valid email address")
    @Column(nullable = false, unique = true)
    private String email;

    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    @Column(name = "cgpa")
    private Double cgpa = 8.0;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "address_id")
    @JsonManagedReference
    private Address address;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    private Course course;

    public Student() {
    }

    public Student(Integer id, String name, String email, Double cgpa, Address address, Course course) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cgpa = cgpa;
        this.address = address;
        this.course = course;
    }

    public Student(String name, String email, Double cgpa, Address address, Course course) {
        this.name = name;
        this.email = email;
        this.cgpa = cgpa;
        this.address = address;
        this.course = course;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
        if (address != null) {
            address.setStudent(this);
        }
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}