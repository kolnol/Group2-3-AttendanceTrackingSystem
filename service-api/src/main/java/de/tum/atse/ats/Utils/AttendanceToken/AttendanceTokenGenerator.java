package de.tum.atse.ats.Utils.AttendanceToken;

import de.tum.atse.ats.Entity.Attendance;

import java.util.Date;

public interface AttendanceTokenGenerator {
    String generate(Long sessionId, Long studentId, Date timestamp);
    Attendance decode(String attendanceToken);
}
