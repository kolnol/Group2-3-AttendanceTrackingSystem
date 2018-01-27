package de.tum.atse.ats.Utils.Seed;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.Session;
import de.tum.atse.ats.Entity.User;


public class SeedInserter {
    private Seed seed = new Seed();

    public void insertSeed() {
        insertUsers();
        insertSessions();
        insertGroups();
    }

    private void insertUsers() {
        for(User user: seed.getUsers()) {
            ObjectifyService.ofy()
                    .save()
                    .entity(user)
                    .now();
        }
    }

    private void insertGroups() {
        for(Group group: seed.getGroups()) {

            for(Session session: ObjectifyService.ofy()
                    .load()
                    .type(Session.class).list()) {
                ObjectifyService.ofy()
                        .save()
                        .entity(session)
                        .now();
                group.addNewSession(session);
            }

            ObjectifyService.ofy()
                    .save()
                    .entity(group)
                    .now();
        }
    }

    private void insertSessions() {
        for(Session session: seed.getSessions()){
            ObjectifyService.ofy()
                    .save()
                    .entity(session)
                    .now();
        }
    }
}
