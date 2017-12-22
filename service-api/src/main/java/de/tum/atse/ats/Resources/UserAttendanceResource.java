package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Attendance;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.RequestUtills;
import org.restlet.Request;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

import java.util.ArrayList;
import java.util.List;

public class UserAttendanceResource extends ServerResource {

    @Get ("json")
    public List<Attendance> getAllAttendances() {
        Long studentId = Long.parseLong(RequestUtills.getValue(getRequest(), "userId"));
        List<Group> groups = ObjectifyService.ofy().load().type(Group.class).list();
        ArrayList<Attendance> attendances = new ArrayList<>();

        for (Group group :
                groups) {
            for (Attendance attendance :
                    group.getAttendances()) {
                if (attendance.getStudentId().equals(studentId)) {
                    attendances.add(attendance);
                }
            }
        }

        return attendances;
    }

}
