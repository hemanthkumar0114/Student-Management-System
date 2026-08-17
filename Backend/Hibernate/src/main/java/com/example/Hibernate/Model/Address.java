package com.example.Hibernate.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String city;

    private String state;

    private String pincode;

    @OneToOne(mappedBy = "address")
    @JsonBackReference
    private Student student;

    public Address() {
    }

    public Address(Integer id, String city, String state, String pincode) {
        this.id = id;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public Address(String city, String state, String pincode) {
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
