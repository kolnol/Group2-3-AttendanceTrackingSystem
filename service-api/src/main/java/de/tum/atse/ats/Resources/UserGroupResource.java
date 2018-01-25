package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

import java.util.List;

public class UserGroupResource extends ServerResource{

    @Get
    public Group getUserGroup() {
        Long studentId = Long.parseLong(RequestUtills.getValue(getRequest(), "studentId"));
        User student = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(studentId)
                .now();

        List<Group> groups = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .list();

        Group studentGroup = null;
        for(Group group: groups) {
            if (group.getStudents().contains(student)) {
                studentGroup = group;
                break;
            }
        }

        return studentGroup;
    }

}
