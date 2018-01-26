package de.tum.atse.ats.Utils;

import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RestletApplication;
import org.restlet.Request;
import org.restlet.data.ClientInfo;
import org.restlet.security.Enroler;
import org.restlet.security.Role;


public class ObjectifyEnroler implements Enroler {

    @Override
    public void enrole(ClientInfo clientInfo) {
        Request request = Request.getCurrent();
        User user = (User) request.getAttributes().get("currentUser");
        if (user!=null && user.getType()!=null) {
            Role role = Role.get(RestletApplication.getCurrent(), user.getType().name());
            clientInfo.getRoles().add(role);
        }
    }
}
