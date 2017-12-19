package de.tum.atse.ats.Entity;

import com.googlecode.objectify.annotation.Entity;

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

}
