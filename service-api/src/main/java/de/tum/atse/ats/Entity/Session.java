package de.tum.atse.ats.Entity;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import java.util.Date;

@Entity
public class Session {
    @Id
    Long id;
    private Date startTime;
    private Date endTime;
    private String place;

    public Session() {}

    public Session(Date startTime, String place) {
        this.startTime = startTime;
        this.place = place;
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
}
