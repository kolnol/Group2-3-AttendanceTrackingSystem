package de.tum.atse.ats.Resources;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.AttendanceToken;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.Session;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.Utils.Seed.SeedInserter;
import org.restlet.data.Status;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

import java.util.List;

public class ResetResource extends ServerResource {

    @Get
    public Status reset() {
        deleteByClass(User.class);
        deleteByClass(Group.class);
        deleteByClass(Session.class);
        deleteByClass(AttendanceToken.class);

        SeedInserter inserter = new SeedInserter();
        inserter.insertSeed();

        return Status.SUCCESS_OK;
    }

    private void deleteByClass(Class clazz) {
        List entitiesList = ObjectifyService.ofy().load().type(clazz).list();
        ObjectifyService.ofy().delete().entities(entitiesList).now();
    }
}
