package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Attendance;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.RequestUtills;
import org.restlet.data.Status;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.List;

public class GroupAttendancesResource extends ServerResource {

    @Get
    public List<Attendance> getAllAttendances () {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        return group.getAttendances();
    }

    @Post
    public Status addAttendance(Attendance attendance) {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
        if(group != null) {
            if(group.getAttendances().contains(attendance)) return Status.SUCCESS_ACCEPTED;

            ObjectifyService.ofy().save().entity(attendance).now();
            group.addAttendance(attendance);

            ObjectifyService.ofy().save().entity(group).now();

            return Status.SUCCESS_OK;
        }

        return Status.CLIENT_ERROR_NOT_FOUND;
    }
}
