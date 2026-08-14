package com.example.Hibernate.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class StudentRequestDTO {

    @NotBlank(message = "Name Is REquired")
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank(message = "Email is Required")
    @Email
    private String email;
    private Integer courseid;
    private String city;
    private String state;
    private String pincode;

    public StudentRequestDTO(){
    }

    public StudentRequestDTO(
            String name,
            String email,
            Integer courseid,
            String city,
            String state,
            String pincode)
    {
        this.name = name;
        this.email = email;
        this.courseid = courseid;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Integer getCourseid() {
        return courseid;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCourseid(Integer courseid) {
        this.courseid = courseid;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
}
