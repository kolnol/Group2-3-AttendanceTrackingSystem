package de.tum.atse.ats.Resources;

import com.google.common.hash.Hashing;
import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.*;
import de.tum.atse.ats.RequestUtills;
import de.tum.atse.ats.Utils.AttendanceToken.AttendanceTokenGenerator;
import de.tum.atse.ats.Utils.AttendanceToken.DesAttendanceTokenGenerator;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;
import org.restlet.data.Status;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AttendanceTokenResource extends ServerResource {
    private final int ALLOWED_REGISTRATION_BEFORE_SESSION_IN_MINUTES = 15;
    // Define the BCrypt workload to use when generating password hashes. 10-31 is a valid value.
    private final int WORKLOAD = 12;
    private final AttendanceTokenGenerator tokenGenerator = new DesAttendanceTokenGenerator("AES",
            "ECB",
            "PKCS5Padding");

    @Get
    public JsonRepresentation getAttendanceToken() {
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

        if (studentGroup == null) return null;
        Session currentSession = getCurrentSession(studentGroup.getSessions());
        if (currentSession == null) return null;
        String token = tokenGenerator.generate(currentSession.getId(), studentId, new Date());
        AttendanceToken attendanceToken = new AttendanceToken(
                token
                ,studentId
                ,currentSession.getId());
        ObjectifyService.ofy().save().entity(attendanceToken).now();

        JSONObject json = new JSONObject();
        json.put("token", token);

        return new JsonRepresentation(json);
    }

    @Post("json")
    public JsonRepresentation validateToken(JsonRepresentation rep) {

        String token = null;
        token = rep.getJsonObject().get("token").toString();
        if(token==null) return null;

        AttendanceToken attendanceToken = ObjectifyService.ofy()
                .load()
                .type(AttendanceToken.class)
                .filter("token", token)
                .first()
                .now();
        if (attendanceToken == null) return null;

        Attendance attendance = tokenGenerator.decode(attendanceToken.getToken());

        if (attendance.getSessionId().equals(attendanceToken.getSessionId())
                && attendance.getStudentId().equals(attendanceToken.getStudentId())) {

            String e = attendance.getStudentId() + "" + attendance.getSessionId();
            e = Hashing.sha256()
                    .hashString(e, StandardCharsets.UTF_8)
                    .toString();
            //e = DigestUtils.sha256Hex(e);

            JSONObject json = new JSONObject();
            json.put("attendance", e);
            json.put("sessionId", attendance.getSessionId() + "");
            //json.put("studentId", attendance.getStudentId() + "");

            ObjectifyService.ofy().delete().entity(attendanceToken).now();
            //TODO Make it clean
            User student = ObjectifyService.ofy()
                    .load()
                    .type(User.class)
                    .id(attendance.getStudentId())
                    .now();
            List<Group> groups = ObjectifyService.ofy()
                    .load()
                    .type(Group.class)
                    .list();
            Group currentGroup = null;
            for(Group group: groups) {
                if(group.getStudents().contains(student)) {
                    currentGroup = group;
                }
            }
            if (currentGroup == null) return null;
            currentGroup.addAttendance(attendance);
            ObjectifyService.ofy()
                    .save()
                    .entity(currentGroup)
                    .now();

            return new JsonRepresentation(json);
        } else {
            return null;
        }
    }

    private String generateAttendanceTokenHash(Long studentId, Long sessionId) {
        String attendance = studentId + "" + sessionId;
        String salt = BCrypt.gensalt(WORKLOAD);
        String attendanceToken = BCrypt.hashpw(attendance, salt);
        return attendanceToken;
    }

    private Session getCurrentSession(List<Session> sessions) {
        Date currentDate = new Date();

        for (Session session: sessions) {
            if (currentDate.after(addBufferToDate(session.getStartTime(), ALLOWED_REGISTRATION_BEFORE_SESSION_IN_MINUTES))
                    && currentDate.before(session.getEndTime())) {
                return session;
            }
        }
        return null;
    }

    private Date addBufferToDate(Date date, int minutes) {
        final long ONE_MINUTE_IN_MILLIS = 60000;//millisecs
        long timeInMs = date.getTime();
        return new Date(timeInMs + (minutes * ONE_MINUTE_IN_MILLIS));
    }

}
