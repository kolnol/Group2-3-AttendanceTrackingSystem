package de.tum.atse.ats.Resources;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.restlet.Request;
import org.restlet.representation.Representation;
import org.restlet.resource.*;

import java.util.List;

public class GroupResource extends ServerResource {

    @Delete
    public void deleteGroup(){
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        ObjectifyService.ofy().delete().type(Group.class).id(groupId).now();
    }

    @Get("json")
    public Group getGroup() {
        Long groupId = Long.parseLong(RequestUtills.getValue(getRequest(), "groupId"));
        return ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .id(groupId)
                .now();
    }

}
