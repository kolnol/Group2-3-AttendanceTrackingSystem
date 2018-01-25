package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.LoadType;
import com.googlecode.objectify.cmd.Query;
import de.tum.atse.ats.Entity.User;
import org.json.JSONObject;
import org.restlet.data.Form;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.ArrayList;
import java.util.List;

public class LoginResource extends ServerResource {

    @Post("json")
    public User loginUser(JsonRepresentation rep) {

        JSONObject jsonObject = rep.getJsonObject();
        String email = jsonObject.get("email").toString();
        String password = jsonObject.get("password").toString();
        List<User> userList = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .list();
        User loggedUser = null;
        for(User user : userList) {
            try{
                if(user.getEmail().equals(email) && user.getPassword().equals(password)) {
                    loggedUser = user;
                    break;
                }
            } catch (NullPointerException e) {
                e.printStackTrace();
            }
        }

        if(loggedUser!=null) {
            return loggedUser;
        }
        return null;
    }
}
