package de.tum.atse.ats;

import de.tum.atse.ats.Resources.*;
import org.restlet.Application;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.Restlet;
import org.restlet.data.LocalReference;
import org.restlet.resource.Directory;
import org.restlet.routing.Router;

public class RestletApplication extends Application {
    @Override
    public Restlet createInboundRoot() {
        Router router = new Router(getContext());

        router.attach("/users", UsersResource.class);
        router.attach("/users/{userId}", UserResource.class);
        router.attach("/users/{userId}/attendances", UserAttendanceResource.class);

        Directory webdir = new Directory(getContext(), "war:///");
        webdir.setDeeplyAccessible(true);
        webdir.setIndexName("index.html");
        router.attach("/main",webdir);

        router.attach("/login", LoginResource.class);
        router.attach("/groups", GroupsResource.class);
        router.attach("/groups/{groupId}", GroupResource.class);

        router.attach("/groups/{groupId}/students", GroupStudentsResource.class);
        router.attach("/groups/{groupId}/students/{userId}", GroupStudentResource.class);

        router.attach("/groups/{groupId}/instructor", GroupInstructorResource.class);
        router.attach("/groups/{groupId}/instructor/{userId}", GroupUodateInstructorResource.class);

        router.attach("/groups/{groupId}/sessions", GroupSessionsResource.class);
        router.attach("/groups/{groupId}/sessions/{sessionId}", GroupSessionResource.class);
        return router;
    }
}
