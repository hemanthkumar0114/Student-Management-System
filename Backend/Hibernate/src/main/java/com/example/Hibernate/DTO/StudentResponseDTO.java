package com.example.Hibernate.DTO;

public class StudentResponseDTO {

   private Integer id;
   private String name;
   private String email;
   private String courseName;
   private String city;
   public StudentResponseDTO(){
   }

    public StudentResponseDTO(
            Integer id,
            String name,
            String email,
            String courseName,
            String city)
    {
        this.id = id;
        this.name = name;
        this.email = email;
        this.courseName = courseName;
        this.city = city;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getEmail() {
        return email;
    }

    public String getCity() {
        return city;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
