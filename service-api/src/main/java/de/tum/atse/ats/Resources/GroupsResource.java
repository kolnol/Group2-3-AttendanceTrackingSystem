package de.tum.atse.ats.Resources;

import com.google.appengine.repackaged.com.google.gson.Gson;
import com.google.appengine.repackaged.com.google.gson.GsonBuilder;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Ref;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import de.tum.atse.ats.RequestUtills;
import org.json.JSONException;
import org.json.JSONObject;
import org.restlet.data.Status;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.representation.Representation;
import org.restlet.resource.Delete;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GroupsResource extends ServerResource {

    final String INSTRUCTORIDTAG = "instructorId";
    final String STUDENTIDTAG = "studentsIds";
    final String GROUPNUMBERTAG = "number";
    @Get
    public List<Group> getGroups() {
        return ObjectifyService
                .ofy()
                .load()
                .type(Group.class)
                .list();
    }

    @Delete
    public Status deleteAllGroups() {
        List<Group> groups = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .list();
        ObjectifyService.ofy().delete().entities(groups).now();
        return Status.SUCCESS_OK;
    }

    @Post
    public Group saveGroup(JsonRepresentation rep) throws IOException {

        JSONObject jsonObject = rep.getJsonObject();
        String number = jsonObject.get(GROUPNUMBERTAG).toString();
        if (number == null || isInDatabase(number)) return null;
        User instructor = ObjectifyService.ofy()
                .load()
                .type(User.class)
                .id(Long.parseLong(jsonObject.get(INSTRUCTORIDTAG).toString()))
                .now();
        if(instructor == null) return null;

        List<User> students = new ArrayList<>();

        try{
            Gson gson = new GsonBuilder().create();
            Long[] studentsIds = gson.fromJson(jsonObject.get(STUDENTIDTAG).toString(), Long[].class);

            for(Long studentId: studentsIds) {
                students.add(ObjectifyService.ofy()
                        .load()
                        .type(User.class)
                        .id(studentId)
                        .now());
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }


        Group newGroup = new Group(number, instructor);

        for (User student: students) {
            newGroup.addNewStudent(student);
        }

        Key<Group> res = ObjectifyService
                .ofy()
                .save()
                .entity(newGroup)
                .now();

        return newGroup;
    }

    private boolean isInDatabase(String groupNumer) {
        int count = ObjectifyService.ofy()
                .load()
                .type(Group.class)
                .filter("number =", groupNumer)
                .count();
        return count > 0;
    }



}
