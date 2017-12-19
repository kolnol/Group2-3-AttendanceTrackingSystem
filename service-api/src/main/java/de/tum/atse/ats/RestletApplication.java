package de.tum.atse.ats;

import de.tum.atse.ats.Resources.*;
import org.restlet.*;
import org.restlet.data.ChallengeScheme;
import org.restlet.data.LocalReference;
import org.restlet.data.Method;
import org.restlet.data.Status;
import org.restlet.ext.oauth.*;
import org.restlet.resource.Directory;
import org.restlet.routing.Router;
import org.restlet.security.ChallengeAuthenticator;
import org.restlet.security.MapVerifier;
import org.restlet.security.SecretVerifier;

public class RestletApplication extends Application {

    private ChallengeAuthenticator authenticatior;

    private ChallengeAuthenticator createAuthenticator() {
        Context context = getContext();
        ChallengeScheme challengeScheme = ChallengeScheme.HTTP_OAUTH_BEARER;
        String realm = "Example site";

        // MapVerifier isn't very secure; see docs for alternatives
        MapVerifier verifier = new MapVerifier();
        verifier.getLocalSecrets().put("user", "password".toCharArray());

        ChallengeAuthenticator auth = new ChallengeAuthenticator(context, false, challengeScheme, realm, verifier);

        /*ChallengeAuthenticator authOnGet = new ChallengeAuthenticator(context, challengeScheme, realm) {
            @Override
            protected int beforeHandle(Request request, Response response) {
                if (request.getMethod() == Method.GET)
                    return super.beforeHandle(request, response);

                response.setStatus(Status.SUCCESS_OK);
                return CONTINUE;
            }
        };*/
        //authOnGet.setVerifier(verifier);

        return auth;
    }

    @Override
    public Restlet createInboundRoot() {
        //this.authenticatior = createAuthenticator();
        //authenticatior.setNext(UsersResource.class);
        String oauthURL = "";

        Router router = new Router(getContext());
        router.attach("/token", AccessTokenServerResource.class);

        //router.attach("/users", authenticatior);


        return router;
    }

   @Override
    public Restlet createInboundRoot() {

        Router router = new Router(getContext());

        Directory webdir = new Directory(getContext(), "war:///");
        webdir.setDeeplyAccessible(true);
        webdir.setIndexName("index.html");

        router.attach("/users", UsersResource.class);
        router.attach("/users/{userId}", UserResource.class);
        router.attach("/users/{userId}/attendances", UserAttendanceResource.class);

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

}
class MyVerifier extends SecretVerifier {
    public int verify(String identifier, char[] secret){
        if( !"guest".equals(identifier) )
            return RESULT_INVALID; //this could also return RESULT_UNKOWN
        if ( compare("1234".toCharArray(), secret) ) {
            return RESULT_VALID;
        } else {
            return RESULT_INVALID;
        }
    }
}