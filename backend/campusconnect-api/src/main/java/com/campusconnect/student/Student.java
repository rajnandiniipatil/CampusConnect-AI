package com.campusconnect.student;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    private String department;
    private Integer yearOfStudy;
    private Double cgpa;

    public Student() {}

    public Student(String name, String email, String department, Integer yearOfStudy, Double cgpa) {
        this.name = name;
        this.email = email;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
        this.cgpa = cgpa;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getDepartment() { return department; }
    public Integer getYearOfStudy() { return yearOfStudy; }
    public Double getCgpa() { return cgpa; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setDepartment(String department) { this.department = department; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
}
