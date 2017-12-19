package de.tum.atse.ats.Entity;

import com.googlecode.objectify.annotation.Subclass;

@Subclass(index=true)
public class Instructor extends User {

    public Instructor(String email, String password) {
        super(email, password, Type.INSTRUCTOR);
    }

    public Instructor(String email, String password, Group group) {
        super(email, password, group);
    }
}
