package de.tum.atse.ats.Entity;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;

import java.util.ArrayList;
import java.util.List;

@Index
@Entity
public class Group {
    @Id
    Long id;
    private String number;
    @Load
    private Ref<User> instructor;
    @Load
    private transient List<Ref<User>> students = new ArrayList<>();
    @Load
    private transient List<Ref<Session>> sessions = new ArrayList<>();
    @Load
    private transient List<Attendance> attendances = new ArrayList<>();
    private int maxParticipants;

    public Group() {}

    public Group(String number, User instructor) {
        this.number = number;
        this.instructor = Ref.create(instructor);
    }

    public Group(Long id, String number, User instructor) {
        this.id = id;
        this.number = number;
        this.instructor = Ref.create(instructor);
    }

    public void addNewStudent(User student) {
        Ref<User> studentRef = Ref.create(student);
        if(!students.contains(studentRef)){
            students.add(studentRef);
        }
    }

    public boolean removeStudent(User student) {
        return students.remove(Ref.create(student));
    }

    public void addNewSession(Session session) {
        Ref<Session> sessionRef = Ref.create(session);
        if (!sessions.contains(sessionRef)) {
            sessions.add(sessionRef);
        }
    }

    public void addAttendance(Attendance attendance) {
        if(!attendances.contains(attendance)) {
            attendances.add(attendance);
        }
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
