package com.campusconnect.dashboard;

import com.campusconnect.academic.AttendanceRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import com.campusconnect.academic.MarkRepository;
import com.campusconnect.student.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;
    private final AttendanceRepository attendance;
    private final MarkRepository marks;

    public DashboardController(StudentRepository students,
                               AttendanceRepository attendance,
                               MarkRepository marks) {
        this.students = students;
        this.attendance = attendance;
        this.marks = marks;
    }
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return Map.of(
                "totalStudents", students.count(),
                "totalAttendanceRecords", attendance.count(),
                "totalMarkRecords", marks.count()
        );
    }
}
