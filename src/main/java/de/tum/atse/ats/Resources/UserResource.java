package de.tum.atse.ats.Resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.appengine.repackaged.com.google.gson.JsonObject;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.User;
import org.restlet.data.Form;
import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class UserResource extends ServerResource {

    //TODO make it clean
    @Get("json")
    public List<User> getUser() {
        try{
            String id = getQueryValue("id").toString();
            User user = ObjectifyService.ofy()
                    .load()
                    .type(User.class)
                    .id(id)
                    .now();
            ArrayList<User> res = new ArrayList<>();
            res.add(user);
            return res;
        }catch (NullPointerException e){
            e.printStackTrace();
            return ObjectifyService.ofy().load().type(User.class).list();
        }
    }

    @Post("json")
    public User saveNewUser(User newUser) throws IOException {
        //String rep = userRep.getText();

        //ObjectMapper mapper =  new ObjectMapper();
        //User newUser = mapper.readValue(rep, User.class);
//        Form form = new Form(userRep);
//        User newUser = new User(form.getFirstValue("email"), form.getFirstValue("password"));
        if(isValid(newUser)) {
            Key<User> res = ObjectifyService.ofy().save().entity(newUser).now();
            return newUser;
//            if (newUser.getId()!=null){
//                return newUser;
//            }
        }
        return null;
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
