package com.campusconnect.academic;

import com.campusconnect.student.Student;
import org.springframework.security.access.prepost.PreAuthorize;
import com.campusconnect.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceController(AttendanceRepository attendanceRepository,
                                 StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
    @GetMapping("/student/{studentId}")
    public List<Attendance> byStudent(@PathVariable Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
    
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @PostMapping("/student/{studentId}")
    public ResponseEntity<Attendance> create(@PathVariable Long studentId,
                                             @RequestBody Attendance attendance) {
        return studentRepository.findById(studentId).map(student -> {
            attendance.setStudent(student);
            return ResponseEntity.ok(attendanceRepository.save(attendance));
        }).orElse(ResponseEntity.notFound().build());
    }
}
