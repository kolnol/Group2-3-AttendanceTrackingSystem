package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;


import java.util.List;

public class GroupInstructorResource extends ServerResource {

    @Get("json")
    public User getInstructor() {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        if(group != null) {
            return group.getInstructor();
        }

        return null;
    }

}
