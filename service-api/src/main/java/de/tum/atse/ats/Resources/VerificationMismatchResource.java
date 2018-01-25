package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Session;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.Entity.VerificationMismatch;
import org.restlet.data.Status;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.List;

public class VerificationMismatchResource extends ServerResource {

    @Get
    public List<VerificationMismatch> getVerificationMismatches() {
        return ObjectifyService.ofy()
                .load()
                .type(VerificationMismatch.class)
                .list();
    }

    @Post
    public Status registerVerificationMismatch(VerificationMismatch mismatch) {
        if(isValid(mismatch)) {
            ObjectifyService.ofy()
                    .save()
                    .entity(mismatch)
                    .now();
            return Status.SUCCESS_ACCEPTED;
        }
        return Status.CLIENT_ERROR_BAD_REQUEST;
    }

    private boolean isValid(VerificationMismatch mismatch) {
        return isNotNull(mismatch)
                && isValidIds(mismatch.getStudentId(), mismatch.getSessionId());
    }

    private boolean isNotNull(VerificationMismatch mismatch) {
        return mismatch!=null
                && mismatch.getSessionId()!= null
                && mismatch.getStudentId() != null
                && mismatch.getTimestamp() != null;
    }

    private boolean isValidIds(Long studentId, Long sessionId) {
        Session session = ObjectifyService.ofy()
                .load()
                .type(Session.class)
                .id(sessionId)
                .now();
        User student = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(studentId)
                .now();
        return session != null && student != null;
    }
}

