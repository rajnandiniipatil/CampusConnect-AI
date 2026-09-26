package com.campusconnect.academic;

import com.campusconnect.student.Student;
import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Mark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Student student;

    private String subject;
    private Double score;
    private Double maxScore;

    public Mark() {}

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public String getSubject() { return subject; }
    public Double getScore() { return score; }
    public Double getMaxScore() { return maxScore; }

    public void setId(Long id) { this.id = id; }
    public void setStudent(Student student) { this.student = student; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setScore(Double score) { this.score = score; }
    public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }

    @Transient
    public double getPercentage() {
        if (maxScore == null || maxScore == 0) return 0;
        return Math.round((score * 10000.0) / maxScore) / 100.0;
    }
}
