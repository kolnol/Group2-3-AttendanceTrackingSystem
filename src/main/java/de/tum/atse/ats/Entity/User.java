package de.tum.atse.ats.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;


@Entity
public class User {
    @Id Long id;
    private String email;
    private String password; //TODO use only hash
    @JsonIgnore
    @Load private Ref<Group> group;

    //Empty constructor is needed to use Objectify
    private User(){}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String email, String password, Group group) {
        this.email = email;
        this.password = password;
        this.group = Ref.create(group);
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

    public Group getGroup() {
        return group.get();
    }

    public void setGroup(Group group) {
        this.group = Ref.create(group);
    }
}
