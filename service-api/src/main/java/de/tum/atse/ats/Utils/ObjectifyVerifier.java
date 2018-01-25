package de.tum.atse.ats.Utils;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.User;
import org.restlet.Request;
import org.restlet.security.SecretVerifier;

public class ObjectifyVerifier extends SecretVerifier {

    @Override
    public int verify(String s, char[] secret) {
        User user = ObjectifyService.ofy().load().type(User.class).filter("email =", s).first().now();
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
