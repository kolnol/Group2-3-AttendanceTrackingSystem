package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Ref;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.data.Status;
import org.restlet.representation.Representation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.List;

public class GroupStudentsResource extends ServerResource {

    @Get("json")
    public List<User> getParticipants() {

        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        if (group != null) {
            return group.getStudents();
        }

        getResponse().setStatus(Status.CLIENT_ERROR_NOT_FOUND, "Group with this id is not found.");
        return null;
    }

}
