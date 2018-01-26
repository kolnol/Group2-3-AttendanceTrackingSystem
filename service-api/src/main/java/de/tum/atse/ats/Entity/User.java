package de.tum.atse.ats.Entity;


import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Index
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
    private Type type;

    private User(){}

    public User(String name,String email, String password, Type type) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.type = type;
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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
