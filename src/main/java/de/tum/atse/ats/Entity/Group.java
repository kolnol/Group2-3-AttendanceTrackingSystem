package de.tum.atse.ats.Entity;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

import java.util.List;

@Entity
public class Group {
    @Id
    Long id;
    private String number;
    @Load
    private Ref<Instructor> instructor;
    @Load
    private List<Ref<Student>> students;
    @Load
    private List<Ref<Meeting>> meetings;

    public Group() {}

    public Long getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Instructor getInstructor() {
        return instructor.get();
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = Ref.create(instructor);
    }

    public List<Ref<Student>> getStudents() {
        return students;
    }

    public void setStudents(List<Ref<Student>> students) {
        this.students = students;
    }

    public List<Ref<Meeting>> getMeetings() {
        return meetings;
    }

    public void setMeetings(List<Ref<Meeting>> meetings) {
        this.meetings = meetings;
    }
}
