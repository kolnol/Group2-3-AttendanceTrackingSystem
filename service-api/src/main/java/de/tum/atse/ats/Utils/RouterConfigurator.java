package de.tum.atse.ats.Utils;

import de.tum.atse.ats.Resources.*;
import org.restlet.Context;
import org.restlet.resource.Directory;
import org.restlet.resource.ServerResource;
import org.restlet.routing.Router;
import org.restlet.security.Authenticator;
import org.restlet.util.RouteList;

import java.util.HashMap;
import java.util.Map;

public class RouterConfigurator {
    private Context context;
    private Router root;
    private Authenticator authenticator;
    private Map<String, Class<? extends ServerResource>> protectedResources = new HashMap<>();
    private Map<String, Class<? extends ServerResource>> publicResources = new HashMap<>();

    public RouterConfigurator(Context context,
                              Authenticator authenticator) {
        this.context = context;
        this.root = new Router(context);
        this.authenticator = authenticator;
        initializeProtectedResources();
        initializePublicResources();
    }

    public Router configure(boolean activateAuthentication) {
        configureMainPage();
        configurePublicRouter();

        Router protectedRouter = configureProtectedRouter();
        authenticator.setNext(protectedRouter);
        if(activateAuthentication) {
            root.attachDefault(authenticator);
        }else {
            root.attachDefault(protectedRouter);
        }

        return root;
    }

    private Router configureProtectedRouter() {
        Router protectedRouter = new Router(context);
        for(String path: protectedResources.keySet()) {
            protectedRouter.attach(path, protectedResources.get(path));
        }

        return protectedRouter;
    }

    private void initializePublicResources() {
        publicResources.put("/login", LoginResource.class);
        publicResources.put("/reset", ResetResource.class);
    }

    private void configurePublicRouter() {

        for(String path: publicResources.keySet()) {
            this.root.attach(path, publicResources.get(path));
        }

    }

    private void configureMainPage() {
        //TODO put Ionic app here
        Directory webdir = new Directory(context, "war:///");
        webdir.setDeeplyAccessible(true);
        webdir.setIndexName("index.html");

        this.root.attach("/main",webdir);
    }

    private void initializeProtectedResources() {
        configureUsersRouter();
        configureGroupsRouter();
        configureAttendanceTokenRouter();
        configureVMismatchRouter();
    }

    private void configureUsersRouter() {
        protectedResources.put("/users", UsersResource.class);
        protectedResources.put("/users/{userId}", UserResource.class);//TODO Add authorizer instead of class
        protectedResources.put("/users/{userId}/attendances", UserAttendanceResource.class);
        protectedResources.put("/users/{studentId}/groups", UserGroupResource.class);
    }

    private void configureGroupsRouter() {
        protectedResources.put("/groups", GroupsResource.class);
        protectedResources.put("/groups/{groupId}", GroupResource.class);

        protectedResources.put("/groups/{groupId}/students", GroupStudentsResource.class);
        protectedResources.put("/groups/{groupId}/students/{userId}", GroupStudentResource.class);
        protectedResources.put("/groups/{groupId}/instructor", GroupInstructorResource.class);
        protectedResources.put("/groups/{groupId}/instructor/{userId}", GroupUodateInstructorResource.class);
        protectedResources.put("/groups/{groupId}/sessions", GroupSessionsResource.class);
        protectedResources.put("/groups/{groupId}/sessions/{sessionId}", GroupSessionResource.class);
        protectedResources.put("/groups/{groupId}/attendances", GroupAttendancesResource.class);
    }

    private void configureAttendanceTokenRouter() {
        //GET = Get Token | POST = Validate Token
        protectedResources.put("/attendanceToken/{studentId}", AttendanceTokenResource.class);
        protectedResources.put("/attendanceToken", AttendanceTokenResource.class);
    }

    private void configureVMismatchRouter() {
        protectedResources.put("/verificationMismatch", VerificationMismatchResource.class);
    }

}
