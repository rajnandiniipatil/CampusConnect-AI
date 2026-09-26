package com.campusconnect.academic;

import com.campusconnect.student.StudentRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarkController {
    private final MarkRepository markRepository;
    private final StudentRepository studentRepository;

    public MarkController(MarkRepository markRepository, StudentRepository studentRepository) {
        this.markRepository = markRepository;
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    @GetMapping("/student/{studentId}")
    public List<Mark> byStudent(@PathVariable Long studentId) {
        return markRepository.findByStudentId(studentId);
    }
    
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @PostMapping("/student/{studentId}")
    public ResponseEntity<Mark> create(@PathVariable Long studentId, @RequestBody Mark mark) {
        return studentRepository.findById(studentId).map(student -> {
            mark.setStudent(student);
            return ResponseEntity.ok(markRepository.save(mark));
        }).orElse(ResponseEntity.notFound().build());
    }
}
