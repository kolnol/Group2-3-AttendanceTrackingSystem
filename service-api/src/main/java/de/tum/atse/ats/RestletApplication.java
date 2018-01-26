package de.tum.atse.ats;

import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.Resources.*;
import de.tum.atse.ats.Utils.ObjectifyEnroler;
import de.tum.atse.ats.Utils.ObjectifyVerifier;
import org.restlet.*;
import org.restlet.data.ChallengeScheme;
import org.restlet.resource.Directory;
import org.restlet.resource.ServerResource;
import org.restlet.routing.Route;
import org.restlet.routing.Router;
import org.restlet.security.*;
import org.restlet.service.CorsService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class RestletApplication extends Application {

    public RestletApplication() {
        CorsService corsService = new CorsService();
        corsService.setAllowedOrigins(new HashSet(Arrays.asList("*")));
        corsService.setAllowedCredentials(true);
        getServices().add(corsService);
    }

   @Override
    public Restlet createInboundRoot() {

        ChallengeAuthenticator guard = new ChallengeAuthenticator(getContext(), ChallengeScheme.HTTP_BASIC, "Test Realm");

        guard.setVerifier(new ObjectifyVerifier());
        guard.setEnroler(new ObjectifyEnroler());

        RoleAuthorizer authorizer = createRoleAuthorizer();

        Router router = new Router(getContext());

        //TODO put Ionic app here
        Directory webdir = new Directory(getContext(), "war:///");
        webdir.setDeeplyAccessible(true);
        webdir.setIndexName("index.html");

       //TODO Activate Authentication = guard.setNext(router); return guard;

       Router first = new Router(getContext());

        router.attach("/users", UsersResource.class);
        router.attach("/users/{userId}", UserResource.class);//TODO Add authorizer instead of class
        router.attach("/users/{userId}/attendances", UserAttendanceResource.class);
        router.attach("/users/{studentId}/groups", UserGroupResource.class);

        first.attach("/main",webdir);

        first.attach("/login", LoginResource.class);

        router.attach("/groups", GroupsResource.class);
        router.attach("/groups/{groupId}", GroupResource.class);

        router.attach("/groups/{groupId}/students", GroupStudentsResource.class);
        router.attach("/groups/{groupId}/students/{userId}", GroupStudentResource.class);

        router.attach("/groups/{groupId}/instructor", GroupInstructorResource.class);
        router.attach("/groups/{groupId}/instructor/{userId}", GroupUodateInstructorResource.class);

        router.attach("/groups/{groupId}/sessions", GroupSessionsResource.class);
        router.attach("/groups/{groupId}/sessions/{sessionId}", GroupSessionResource.class);

        router.attach("/groups/{groupId}/attendances", GroupAttendancesResource.class);

        //GET = Get Token | POST = Validate Token
        router.attach("/attendanceToken/{studentId}", AttendanceTokenResource.class);
        router.attach("/attendanceToken", AttendanceTokenResource.class);

        router.attach("/verificationMismatch", VerificationMismatchResource.class);

        router.attach("/reset", ResetResource.class);

        //TODO Add Authorization only where is needed
        authorizer.setNext(UserResource.class);
        guard.setNext(router);
        first.attach("/private", guard);

        return first;
    }

    private RoleAuthorizer createRoleAuthorizer() {
        //Authorize owners and forbid users on roleAuth's children
        RoleAuthorizer roleAuth = new RoleAuthorizer();
        roleAuth.getAuthorizedRoles().add(Role.get(this, User.Type.INSTRUCTOR.name()));
        roleAuth.getForbiddenRoles().add(Role.get(this, User.Type.STUDENT.name()));
        return roleAuth;
    }

}
