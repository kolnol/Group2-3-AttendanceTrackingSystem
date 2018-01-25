package AttendanceToken;

import java.util.Date;

public interface AttendanceTokenGenerator {
    String generate(Long sessionId, Long studentId, Date timestamp);
    Attendance decode(String attendanceToken);
}
