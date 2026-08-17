package com.example.Hibernate.DTO;

import com.example.Hibernate.Model.Student;

public class StudentResponseDTO {

    private Integer id;
    private String name;
    private String email;
    private Double cgpa;
    private Integer courseId;
    private String courseName;
    private String duration;
    private Integer addressId;
    private String city;
    private String state;
    private String pincode;

    // Nested objects for full JSON representation
    private AddressDTO address;
    private CourseDTO course;

    public static class AddressDTO {
        private Integer id;
        private String city;
        private String state;
        private String pincode;

        public AddressDTO() {}
        public AddressDTO(Integer id, String city, String state, String pincode) {
            this.id = id;
            this.city = city;
            this.state = state;
            this.pincode = pincode;
        }
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }
    }

    public static class CourseDTO {
        private Integer id;
        private String courseName;
        private String duration;
        private String department;

        public CourseDTO() {}
        public CourseDTO(Integer id, String courseName, String duration, String department) {
            this.id = id;
            this.courseName = courseName;
            this.duration = duration;
            this.department = department;
        }
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String courseName) { this.courseName = courseName; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
    }

    public StudentResponseDTO() {
    }

    public StudentResponseDTO(Student student) {
        if (student != null) {
            this.id = student.getId();
            this.name = student.getName();
            this.email = student.getEmail();
            this.cgpa = student.getCgpa();

            if (student.getAddress() != null) {
                this.addressId = student.getAddress().getId();
                this.city = student.getAddress().getCity();
                this.state = student.getAddress().getState();
                this.pincode = student.getAddress().getPincode();
                this.address = new AddressDTO(
                    student.getAddress().getId(),
                    student.getAddress().getCity(),
                    student.getAddress().getState(),
                    student.getAddress().getPincode()
                );
            }

            if (student.getCourse() != null) {
                this.courseId = student.getCourse().getId();
                this.courseName = student.getCourse().getCourseName();
                this.duration = student.getCourse().getDuration();
                this.course = new CourseDTO(
                    student.getCourse().getId(),
                    student.getCourse().getCourseName(),
                    student.getCourse().getDuration(),
                    student.getCourse().getDepartment()
                );
            }
        }
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

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getAddressId() {
        return addressId;
    }

    public void setAddressId(Integer addressId) {
        this.addressId = addressId;
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

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }
}
