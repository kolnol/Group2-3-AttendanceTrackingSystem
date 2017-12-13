package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.LoadType;
import com.googlecode.objectify.cmd.Query;
import de.tum.atse.ats.Entity.User;
import org.restlet.data.Form;
import org.restlet.representation.Representation;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.ArrayList;
import java.util.List;

public class LoginResource extends ServerResource {
    @Post
    public void loginUser(Representation rep) {
        Form form = new Form(rep);
        String email = form.getFirstValue("email");
        String password = form.getFirstValue("password");
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
            redirectPermanent(getRootRef().toString() + "/main");
        }
    }
}
