package AttendanceToken;

import java.util.Date;

public class Attendance {
    private final Long studentId;
    private final Long sessionId;
    private final Date timestamp;

    public Attendance(Long studentId, Long sessionId, Date timestamp) {
        this.studentId = studentId;
        this.sessionId = sessionId;
        this.timestamp = timestamp;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "Attendance{" +
                "studentId=" + studentId +
                ", sessionId=" + sessionId +
                ", timestamp=" + timestamp +
                '}';
    }
}
