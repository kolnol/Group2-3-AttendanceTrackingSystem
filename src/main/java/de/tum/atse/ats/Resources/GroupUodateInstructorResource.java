package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;

import org.restlet.data.Status;

public class GroupUodateInstructorResource extends ServerResource {

    @Put("json")
    public Status changeInstructor() {
        Long userId = Long.parseLong(RequestUtills.getValue(getRequest(), "userId"));
        User instructor = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(userId)
                .now();

        if(instructor.getType() != User.Type.INSTRUCTOR) {
            return Status.CLIENT_ERROR_NOT_ACCEPTABLE;
        }

        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        group.setInstructor(instructor);
        ObjectifyService.ofy().save().entity(group);

        return org.restlet.data.Status.SUCCESS_OK;
    }

}
