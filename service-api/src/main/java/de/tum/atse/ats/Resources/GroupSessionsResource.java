package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.Session;
import de.tum.atse.ats.RequestUtills;
import org.restlet.data.Status;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.List;

public class GroupSessionsResource extends ServerResource {

    @Get("json")
    public List<Session> getSesssions() {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        if(group != null) {
            return group.getSessions();
        }
        return null;
    }

    @Post
    public Status addSession(Session session) {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        if(group != null) {
            group.addNewSession(session);
            ObjectifyService.ofy().save().entity(group).now();
            return Status.SUCCESS_OK;
        }

        return Status.CLIENT_ERROR_NOT_FOUND;
    }

}
