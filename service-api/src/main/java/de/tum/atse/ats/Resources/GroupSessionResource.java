package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Session;
import de.tum.atse.ats.RequestUtills;
import org.restlet.data.Status;
import org.restlet.resource.Delete;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;

public class GroupSessionResource extends ServerResource {

    @Get("json")
    public Session getSession() {
        Long sessionId = Long.parseLong(RequestUtills.getValue(getRequest(), "sessionId"));
        Session session = ObjectifyService.ofy()
                .load()
                .type(Session.class)
                .id(sessionId)
                .now();

        return session;
    }

    @Put
    public Status updateSession(Session newSession) {
        Long sessionId = Long.parseLong(RequestUtills.getValue(getRequest(), "sessionId"));
        Session session = ObjectifyService.ofy()
                .load()
                .type(Session.class)
                .id(sessionId)
                .now();
        if(session != null) {
            session.setPlace(newSession.getPlace() == null ? session.getPlace() : newSession.getPlace());
            session.setStartTime(newSession.getStartTime() == null ? session.getStartTime() : newSession.getStartTime());
            session.setEndTime(newSession.getEndTime() == null ? session.getEndTime() : newSession.getEndTime());
            session.setState(newSession.getState() == null ? session.getState() : newSession.getState());
            ObjectifyService.ofy()
                    .save()
                    .entity(session)
                    .now();
            return Status.SUCCESS_OK;
        }

        return Status.CLIENT_ERROR_NOT_FOUND;
    }

    @Delete
    public Status deleteSession() {
        Long sessionId = Long.parseLong(RequestUtills.getValue(getRequest(), "sessionId"));
        ObjectifyService.ofy()
                .delete()
                .type(Session.class)
                .id(sessionId)
                .now();
        return Status.SUCCESS_OK;
    }
}
