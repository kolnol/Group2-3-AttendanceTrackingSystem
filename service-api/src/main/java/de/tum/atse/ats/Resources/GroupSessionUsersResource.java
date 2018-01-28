package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Attendance;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

import java.util.ArrayList;
import java.util.List;

public class GroupSessionUsersResource extends ServerResource {

    @Get
    public List<User> getStudentsFromSession() {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        Long sessionId = Long.parseLong(RequestUtills.getValue(getRequest(), "sessionId"));

        Group group = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();

        List<User> attendedStudents = new ArrayList<>();
        for(Attendance attendance: group.getAttendances()) {
            if(attendance.getSessionId().equals(sessionId)) {
                User userById = getUserById(group.getStudents(), attendance.getStudentId());
                if (userById != null){
                    attendedStudents.add(userById);
                }
            }
        }

        return attendedStudents;
    }

    private User getUserById(List<User> students, Long id) {
        for(User student: students) {
            if(student.getId().equals(id)) {
                return student;
            }
        }
        return null;
    }
}
