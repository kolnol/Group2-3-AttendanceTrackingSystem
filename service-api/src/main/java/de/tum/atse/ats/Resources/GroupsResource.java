package de.tum.atse.ats.Resources;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.util.List;

public class GroupsResource extends ServerResource {

    @Get
    public List<Group> getGroups() {
        return ObjectifyService
                .ofy()
                .load()
                .type(Group.class)
                .list();
    }

    @Post
    public Group saveGroup(Group newGroup) {
        Key<Group> res = ObjectifyService
                .ofy()
                .save()
                .entity(newGroup)
                .now();
        return newGroup;
    }

}
