package de.tum.atse.ats.Utils.Seed;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import de.tum.atse.ats.Entity.User;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONArray;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class SeedInserter {
    Gson gson = new GsonBuilder().create();
    String serverUrl = "http://localhost:8080/servlet/";
    String usersEndpoint = "users";
    String groupsEndpoint = "groups";
    String groupsStudentsEndpoint = "groups/{groupId}/students/{userId}";
    String groupsSessionsEndpoint = "groups/{groupId}/sessions";

    final int groupsAmount = 4;
    final int studentsAmount = 4;

    public static void main(String[] args) {
        SeedInserter seedInserter = new SeedInserter();
        //seedInserter.insertUsers();
        seedInserter.insertSeed();
    }

    public void insertSeed() {
        insertUsers();
        insertGroups();
    }

    public void insertUsers() {
        //String usersJson = getTextFromFile(usersJsonFile);
        String usersJson = Seed.getUsersSeed();
        User[] users = gson.fromJson(usersJson, User[].class);
        for(User user: users) {
            sendToServer(gson.toJson(user), usersEndpoint);
        }
    }

    public void insertGroups() {
        //String groupsJson = getTextFromFile(groupsJsonFile);
        String groupsJson = Seed.getGroupsSeed();
        JSONArray groups = new JSONArray(groupsJson);
        for (int i = 0; i < groups.length(); i++) {
            sendToServer(groups.getJSONObject(i).toString(), groupsEndpoint);
        }
        addSessions();
    }

    private void addSessions() {
        //String sessionsJson = getTextFromFile(sessionsJsonFile);
        String sessionsJson = Seed.getSessionsSeed();
        JSONArray sessions = new JSONArray(sessionsJson);
        for (int i = 1; i <= groupsAmount; i++) {
            for (int j = 0; j < sessions.length(); j++) {
                String endpoint = groupsSessionsEndpoint.replace("{groupId}", i+"");
                sendToServer(sessions.getJSONObject(j).toString(), endpoint);
            }
        }
    }

    private void addStudents() {
        for (int i = 1; i <= groupsAmount; i++) {
            for(int j = 1; j <= studentsAmount; j++) {
                String endpoint = groupsStudentsEndpoint.replace("{groupId}", i+"");
                endpoint = endpoint.replace("{userId}", (j+4) + "");
                sendPutToServer("", endpoint);
            }
        }
    }

    private void sendPutToServer(String json, String endpoint) {
        HttpClient httpClient = HttpClientBuilder.create().build(); //Use this instead

        try {
            HttpPut request = new HttpPut(serverUrl + endpoint);
            StringEntity params =new StringEntity(json);
            request.addHeader("content-type", "application/json");
            request.setEntity(params);
            HttpResponse response = httpClient.execute(request);
            if(response.getStatusLine().getStatusCode() != 200) {
                System.out.println(response.toString());
                System.out.println(response.getStatusLine());
            }

        }catch (Exception ex) {

            //handle exception here

        }
    }

    private void sendToServer(String json, String endpoint) {
        HttpClient httpClient = HttpClientBuilder.create().build(); //Use this instead

        try {
            HttpPost request = new HttpPost(serverUrl + endpoint);
            StringEntity params =new StringEntity(json);
            request.addHeader("content-type", "application/json");
            request.setEntity(params);
            HttpResponse response = httpClient.execute(request);
            if(response.getStatusLine().getStatusCode() != 200) {
                System.out.println(response.toString());
                System.out.println(response.getStatusLine());
            }
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
