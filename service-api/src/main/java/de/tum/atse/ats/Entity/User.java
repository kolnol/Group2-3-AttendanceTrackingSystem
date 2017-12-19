package de.tum.atse.ats.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

@Entity
public class User {
    public enum Type {
        INSTRUCTOR,
        STUDENT
    }
    @Id Long id;
    private String email;
    private String name;
    private String password; //TODO use only hash
    private Enum<Type> type;

    //Empty constructor is needed to use Objectify
    private User(){}

    public User(String email, String password, Enum<Type> type) {
        this.email = email;
        this.password = password;
    }

    public User(String email, String password, Group group) {
        this.email = email;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Enum<Type> getType() {
        return type;
    }

    public void setType(Enum<Type> type) {
        this.type = type;
    }
}
