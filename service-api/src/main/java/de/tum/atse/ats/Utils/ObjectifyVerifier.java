package de.tum.atse.ats.Utils;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.User;
import org.restlet.Request;
import org.restlet.security.SecretVerifier;

import java.util.List;

public class ObjectifyVerifier extends SecretVerifier {

    @Override
    public int verify(String s, char[] secret) {
        List<User> users = ObjectifyService.ofy().load().type(User.class).list();
        /*User user = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .filter("email", s)
                .first()
                .now();*/
        User user = null;

        for(User userToChoose: users) {
            if(userToChoose.getEmail()!= null) {
                if(userToChoose.getEmail().equals(s)) {
                    user = userToChoose;
                    break;
                }
            }
        }

        if (user!=null
                && compare(user.getPassword().toCharArray(), secret)) {
            Request request = Request.getCurrent();
            request.getAttributes().put("currentUser", user);
            return SecretVerifier.RESULT_VALID;
        } else {
            return SecretVerifier.RESULT_INVALID;
        }
    }
}
