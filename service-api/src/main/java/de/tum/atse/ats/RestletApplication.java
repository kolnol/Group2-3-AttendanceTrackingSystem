package de.tum.atse.ats;

import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.Utils.ObjectifyEnroler;
import de.tum.atse.ats.Utils.ObjectifyVerifier;
import de.tum.atse.ats.Utils.RouterConfigurator;
import org.restlet.*;
import org.restlet.data.ChallengeScheme;
import org.restlet.security.*;
import org.restlet.service.CorsService;

import java.util.Arrays;
import java.util.HashSet;


public class RestletApplication extends Application {

    public RestletApplication() {
        CorsService corsService = new CorsService();
        corsService.setAllowedOrigins(new HashSet(Arrays.asList("*")));
        corsService.setAllowedCredentials(true);
        corsService.setSkippingResourceForCorsOptions(true);
        getServices().add(corsService);
    }

   @Override
    public Restlet createInboundRoot() {
        ChallengeAuthenticator guard = createAuthenticator();

        RoleAuthorizer authorizer = createInstructorAuthorizer();

        return new RouterConfigurator(getContext(), guard).configure(true);
    }

    private RoleAuthorizer createInstructorAuthorizer() {
        //Authorize owners and forbid users on roleAuth's children
        RoleAuthorizer roleAuth = new RoleAuthorizer();
        roleAuth.getAuthorizedRoles().add(Role.get(this, User.Type.INSTRUCTOR.name()));
        roleAuth.getForbiddenRoles().add(Role.get(this, User.Type.STUDENT.name()));
        return roleAuth;
    }

    private ChallengeAuthenticator createAuthenticator() {
        ChallengeAuthenticator guard = new ChallengeAuthenticator(getContext(), ChallengeScheme.HTTP_BASIC, "Test Realm");

        guard.setVerifier(new ObjectifyVerifier());
        guard.setEnroler(new ObjectifyEnroler());

        return guard;
    }

}
