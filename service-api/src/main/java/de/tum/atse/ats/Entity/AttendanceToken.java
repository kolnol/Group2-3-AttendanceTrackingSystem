package de.tum.atse.ats.Entity;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.Date;

@Entity
public class AttendanceToken {
    @Id
    Long id;
    @Index private String token;
    private Long studentId;
    private Long sessionId;

    public AttendanceToken(String token, Long studentId, Long sessionId) {
        this.token = token;
        this.studentId = studentId;
        this.sessionId = sessionId;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getSessionId() {
        return sessionId;
    }
}
