package de.tum.atse.ats.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;

import java.util.Date;

@Index
@Entity
public class VerificationMismatch {

    @Id
    private Long id;

    @Load
    @JsonFormat
            (shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date timestamp;
    private Long studentId;
    private Long sessionId;

    public VerificationMismatch() {
    }

    public VerificationMismatch(Date timestamp, Long studentId, Long sessionId) {
        this.timestamp = timestamp;
        this.studentId = studentId;
        this.sessionId = sessionId;
    }

    public Long getId() {
        return id;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getSessionId() {
        return sessionId;
    }
}
