package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.data.Status;
import org.restlet.resource.Delete;
import org.restlet.resource.Post;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;

public class GroupStudentResource extends ServerResource {

    @Put("json")
    public Status addStudent() {
        Long userId = Long.parseLong(RequestUtills.getValue(getRequest(), "userId"));
        User student = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(userId)
                .now();

        if(student.getType() != User.Type.STUDENT) {
            return Status.CLIENT_ERROR_NOT_ACCEPTABLE;
        }
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        group.addNewStudent(student);
        ObjectifyService.ofy().save().entity(group);

        return Status.SUCCESS_OK;
    }

    @Delete
    public Status removeStudent() {
        Long userId = Long.parseLong(RequestUtills.getValue(getRequest(), "userId"));
        User student = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(userId)
                .now();

        if(student.getType() != User.Type.STUDENT) {
            return Status.CLIENT_ERROR_NOT_ACCEPTABLE;
        }

        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        group.removeStudent(student);
        ObjectifyService.ofy().save().entity(group);

        return Status.SUCCESS_OK;
    }
}
