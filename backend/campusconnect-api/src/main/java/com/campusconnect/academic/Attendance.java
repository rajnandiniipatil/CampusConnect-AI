package com.campusconnect.academic;

import com.campusconnect.student.Student;
import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Student student;

    private String subject;
    private Integer attendedClasses;
    private Integer totalClasses;

    public Attendance() {}

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public String getSubject() { return subject; }
    public Integer getAttendedClasses() { return attendedClasses; }
    public Integer getTotalClasses() { return totalClasses; }

    public void setId(Long id) { this.id = id; }
    public void setStudent(Student student) { this.student = student; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setAttendedClasses(Integer attendedClasses) { this.attendedClasses = attendedClasses; }
    public void setTotalClasses(Integer totalClasses) { this.totalClasses = totalClasses; }

    @Transient
    public double getPercentage() {
        if (totalClasses == null || totalClasses == 0) return 0;
        return Math.round((attendedClasses * 10000.0) / totalClasses) / 100.0;
    }
}
