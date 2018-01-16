package de.tum.atse.ats.Entity;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Group {
    @Id
    Long id;
    private String number;
    @Load
    private Ref<User> instructor;
    @Load
    private final List<Ref<User>> students = new ArrayList<>();
    @Load
    private final List<Ref<Session>> sessions = new ArrayList<>();
    @Load
    private final List<Attendance> attendances = new ArrayList<>();
    private int maxParticipnts;

    public Group() {}

    public Group(String number, User instructor) {
        this.number = number;
        this.instructor = Ref.create(instructor);
    }

    public boolean addNewStudent(User student) {
        return this.students.add(Ref.create(student));
    }

    public boolean removeStudent(User student) {
        return students.remove(Ref.create(student));
    }

    public boolean addNewSession(Session session) {
        return this.sessions.add(Ref.create(session));
    }

    public Long getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public User getInstructor() {
        return instructor.get();
    }

    public void setInstructor(User instructor) {
        this.instructor = Ref.create(instructor);
    }

    public List<User> getStudents() {
        ArrayList<User> students = new ArrayList<>();
        for(Ref<User> student: this.students) {
            students.add(student.get());
        }
        return students;
    }

    public List<Session> getSessions() {
        ArrayList<Session> sessions = new ArrayList<>();
        for(Ref<Session> session: this.sessions) {
            sessions.add(session.get());
        }
        return sessions;
    }

    public List<Attendance> getAttendances() {
        return attendances;
    }
}
