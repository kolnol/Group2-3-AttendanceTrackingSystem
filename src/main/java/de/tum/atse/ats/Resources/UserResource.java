package de.tum.atse.ats.Resources;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.data.Status;
import org.restlet.resource.Delete;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class UserResource extends ServerResource {

    @Get("json")
    public User getUser() {
        Long userId = Long.parseLong(RequestUtills.getValue(getRequest(), "userId"));
        return ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(userId)
                .now();
    }

    @Delete
    public Status deleteUser() {
        Long userId = Long.parseLong(RequestUtills.getValue(getRequest(), "userId"));
        ObjectifyService.ofy().delete().type(User.class).id(userId).now();
        return Status.SUCCESS_OK;
    }

}
