package de.tum.atse.ats.Entity;

import com.googlecode.objectify.annotation.Subclass;

@Subclass(index=true)
public class Student extends User {
    public Student(String email, String password) {
        super(email, password);
    }

    public Student(String email, String password, Group group) {
        super(email, password, group);
    }
}
