package de.tum.atse.ats.Resources;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.User;
import org.restlet.resource.Delete;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class UsersResource extends ServerResource {

    @Get("json")
    public List<User> getAllUsers() {
        List<User> userList = ObjectifyService.ofy().load().type(User.class).list();
        return userList;
    }

    @Post("json")
    public User saveNewUser(User newUser) throws IOException {
        if(isValid(newUser) && !isInDatabase(newUser)) {
            ObjectifyService.ofy().save().entity(newUser).now();
            return newUser;
        }
        return null;
    }

    @Delete
    public void deleteAllUsers() {
        List<User> userList = ObjectifyService.ofy().load().type(User.class).list();
        ObjectifyService.ofy().delete().entities(userList).now();
    }

    private boolean isInDatabase(User newUser) {
        int count = ObjectifyService.ofy().load().type(User.class).filter("email =", newUser.getEmail()).count();
        return count > 0;
    }

    //TODO add validation inside of the object
    private boolean isValid(User user) {
        try{
            return !Objects.equals(user.getEmail(), "")
                    && !Objects.equals(user.getPassword(), "");
        }catch (NullPointerException e){
            e.printStackTrace();
            return false;
        }
    }
}
