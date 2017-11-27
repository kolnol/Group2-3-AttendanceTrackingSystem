package de.tum.atse.ats.Entity;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import java.util.Date;

@Entity
public class Meeting {
    @Id
    Long id;
    private Date time;
    private String place;

    public Meeting() {
    }

    public Meeting(Date time, String place) {
        this.time = time;
        this.place = place;
    }

    public Long getId() {
        return id;
    }

    public Date getTime() {

        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }
}
