package de.tum.atse.ats;

import de.tum.atse.ats.Resources.LoginResource;
import de.tum.atse.ats.Resources.UserResource;
import org.restlet.Application;
import org.restlet.Restlet;
import org.restlet.data.LocalReference;
import org.restlet.resource.Directory;
import org.restlet.routing.Router;

public class RestletApplication extends Application {
    @Override
    public Restlet createInboundRoot() {
        Router router = new Router(getContext());

        router.attach("/users", UserResource.class);
        Directory webdir = new Directory(getContext(), "war:///");
        webdir.setDeeplyAccessible(true);
        webdir.setIndexName("index.html");
        router.attach("/main",webdir);
        router.attach("/login", LoginResource.class);

//        LocalReference clapReference = LocalReference.createClapReference(LocalReference.CLAP_THREAD,
//                "/src/main/webapp/index.html");
//        Directory directory = new Directory(getContext(),
//                LocalReference.createClapReference(LocalReference.CLAP_THREAD,
//                        "/src/main/webapp/index.html"));
//
//        router.attach("/login", directory);

        return router;
    }
}
