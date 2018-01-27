package de.tum.atse.ats.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

import java.util.Date;

@Entity
public class Session {

    public enum State {
        PLANNED,
        ONGOING,
        FINISHED
    }

    @Id
    Long id;
    @Load
    @JsonFormat
            (shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date startTime;
    @Load
    @JsonFormat
            (shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date endTime;
    private String place;
    private State state;


    public Session() {}

    public Session(Date startTime,
                   Date endTime,
                   String place) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.place = place;
        this.state = State.PLANNED;
    }

    public Long getId() {
        return id;
    }

    public Date getStartTime() {

        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }
}
