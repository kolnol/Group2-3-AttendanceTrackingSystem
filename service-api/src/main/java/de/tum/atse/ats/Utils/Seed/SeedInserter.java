package de.tum.atse.ats.Utils.Seed;

import com.google.appengine.repackaged.com.google.gson.Gson;
import com.google.appengine.repackaged.com.google.gson.GsonBuilder;
import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.User;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class SeedInserter {
    String usersJsonFile = "/Users/Nokid/Dropbox/Studium/Semester 7/ATSE/Project/service-api/src/main/java/de/tum/atse/ats/Utils/Seed/users.json";
    String groupsJsonFile = "/Users/Nokid/Dropbox/Studium/Semester 7/ATSE/Project/service-api/src/main/java/de/tum/atse/ats/Utils/Seed/groups.json";
    Gson gson = new GsonBuilder().create();
    String serverUrl = "https://atseguestbook-185902.appspot.com/servlet/";
    String usersEndpoint = "users";
    String groupsEndpoint = "groups";

    public static void main(String[] args) {
        SeedInserter seedInserter = new SeedInserter();
        //seedInserter.insertUsers();
        seedInserter.insertGroups();
    }

    public void insertUsers() {
        String usersJson = getTextFromFile(usersJsonFile);
        User[] users = gson.fromJson(usersJson, User[].class);
        for(User user: users) {
            sendToServer(gson.toJson(user), usersEndpoint);
        }
    }

    public void insertGroups() {
        String groupsJson = getTextFromFile(groupsJsonFile);
        sendToServer(groupsJson, groupsEndpoint);
    }

    private void sendToServer(String json, String endpoint) {
        HttpClient httpClient = HttpClientBuilder.create().build(); //Use this instead

        try {

            HttpPost request = new HttpPost(serverUrl + endpoint);
            StringEntity params =new StringEntity(json);
            request.addHeader("content-type", "application/json");
            request.setEntity(params);
            HttpResponse response = httpClient.execute(request);
            System.out.println(response.getStatusLine());

        }catch (Exception ex) {

            //handle exception here

        }
    }

    private String getTextFromFile(String fileName) {
        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {

            String sCurrentLine;
            StringBuilder text = new StringBuilder();
            while ((sCurrentLine = br.readLine()) != null) {
                text.append(sCurrentLine);
            }

            return text.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
