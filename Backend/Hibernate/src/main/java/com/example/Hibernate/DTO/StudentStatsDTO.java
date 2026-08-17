package com.example.Hibernate.DTO;

import java.util.Map;

public class StudentStatsDTO {
    private long totalStudents;
    private long totalCourses;
    private double averageCgpa;
    private long honorsStudents; // CGPA >= 8.5
    private Map<String, Long> studentsPerCourse;

    public StudentStatsDTO() {}

    public StudentStatsDTO(long totalStudents, long totalCourses, double averageCgpa, long honorsStudents, Map<String, Long> studentsPerCourse) {
        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.averageCgpa = averageCgpa;
        this.honorsStudents = honorsStudents;
        this.studentsPerCourse = studentsPerCourse;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public double getAverageCgpa() {
        return averageCgpa;
    }

    public void setAverageCgpa(double averageCgpa) {
        this.averageCgpa = averageCgpa;
    }

    public long getHonorsStudents() {
        return honorsStudents;
    }

    public void setHonorsStudents(long honorsStudents) {
        this.honorsStudents = honorsStudents;
    }

    public Map<String, Long> getStudentsPerCourse() {
        return studentsPerCourse;
    }

    public void setStudentsPerCourse(Map<String, Long> studentsPerCourse) {
        this.studentsPerCourse = studentsPerCourse;
    }
}
