package de.tum.atse.ats.Utils.Seed;

import de.tum.atse.ats.Entity.Group;
import de.tum.atse.ats.Entity.Session;
import de.tum.atse.ats.Entity.User;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Seed {
    private final List<User> users = new ArrayList<>();
    private final List<Session> sessions = new ArrayList<>();
    private final List<Group> groups = new ArrayList<>();

    Seed() {
        initUsers();
        initSessions();
        initGroups();
    }

    private void initUsers() {
        users.add(new User(1L,
                "Sebastian Barschkis",
                "sebastian@outlook.com",
                "pass",
                User.Type.INSTRUCTOR));

        users.add(new User(2L,
                "Cool Man",
                "man@outlook.com",
                "pass",
                User.Type.INSTRUCTOR));

        users.add(new User(3L,
                "Renhcsterp Rednaxela",
                "pret@outlook.com",
                "pass",
                User.Type.INSTRUCTOR));

        users.add(new User(4L,
                "Oanh Do",
                "do@outlook.com",
                "pass",
                User.Type.INSTRUCTOR));

        users.add(new User(5L,
                "Mykola Odnoshyvkin",
                "odn@gmail.com",
                "pass",
                User.Type.STUDENT));

        users.add(new User(6L,
                "Georgi Aylov",
                "geor@me.com",
                "veryGoodPass",
                User.Type.STUDENT));

        users.add(new User(7L,
                "Phuong Mai",
                "mai@yahoo.com",
                "pass123654",
                User.Type.STUDENT));

        users.add(new User(8L,
                "Max Tharr",
                "max@tharr.com",
                "maxTheBest",
                User.Type.STUDENT));
    }

    private void initSessions() {
        sessions.add(new Session(
                dateFromString("2018-01-12T10:00:00"),
                dateFromString("2018-01-26T00:00:00"),
                "01.10.09"));

        sessions.add(new Session(
                dateFromString("2018-01-12T10:00:00"),
                dateFromString("2018-01-26T00:00:00"),
                "01.10.354"));
    }

    private void initGroups() {

        groups.add(new Group(1L,
                "1-3",
                users.get(0)));

        groups.add(new Group(2L,
                "2-3",
                users.get(1)));
        groups.get(1)
                .addNewStudent(users
                        .get(4));
        groups.get(1)
                .addNewStudent(users
                        .get(7));

        groups.add(new Group(3L,
                "3-3",
                users.get(2)));
        groups.get(2)
                .addNewStudent(users
                        .get(5));

        groups.add(new Group(4L,
                "4-3",
                users.get(3)));
        groups.get(3)
                .addNewStudent(users
                        .get(6));

    }

    private Date dateFromString(String date) {
        try{
            return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                    .parse(date);
        } catch (ParseException e) {
            System.out.println("Wrong date Format!");
        }
        return null;
    }

    public List<User> getUsers() {
        return users;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public static String getGroupsSeed() {
        return "[\n" +
                "  {\n" +
                "    \"id\": 1,\n" +
                "    \"number\": \"1-3\",\n" +
                "    \"instructorId\": 1,\n" +
                "    \"studentsIds\": []\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 2,\n" +
                "    \"number\": \"2-3\",\n" +
                "    \"instructorId\": 2,\n" +
                "    \"studentsIds\": [5,8]\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 3,\n" +
                "    \"number\": \"3-3\",\n" +
                "    \"instructorId\": 3,\n" +
                "    \"studentsIds\": [6]\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 4,\n" +
                "    \"number\": \"4-3\",\n" +
                "    \"instructorId\": 4,\n" +
                "    \"studentsIds\": [7]\n" +
                "  }\n" +
                "]\n" +
                "\n";
    }

    public static String getUsersSeed() {
        return "[\n" +
                "  {\n" +
                "    \"id\": 1,\n" +
                "    \"email\": \"sebastian@outlook.com\",\n" +
                "    \"password\": \"pass\",\n" +
                "    \"name\": \"Sebastian Barschkis\",\n" +
                "    \"type\": \"INSTRUCTOR\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 2,\n" +
                "    \"email\": \"man@outlook.com\",\n" +
                "    \"password\": \"pass\",\n" +
                "    \"name\": \"Cool Man\",\n" +
                "    \"type\": \"INSTRUCTOR\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 3,\n" +
                "    \"email\": \"pret@outlook.com\",\n" +
                "    \"password\": \"pass\",\n" +
                "    \"name\": \"Renhcsterp Rednaxela\",\n" +
                "    \"type\": \"INSTRUCTOR\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 4,\n" +
                "    \"email\": \"do@outlook.com\",\n" +
                "    \"password\": \"pass\",\n" +
                "    \"name\": \"Oanh Do\",\n" +
                "    \"type\": \"INSTRUCTOR\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 5,\n" +
                "    \"email\": \"odn@gmail.com\",\n" +
                "    \"password\": \"pass\",\n" +
                "    \"name\": \"Mykola Odnoshyvkin\",\n" +
                "    \"type\": \"STUDENT\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 6,\n" +
                "    \"email\": \"geor@me.com\",\n" +
                "    \"password\": \"veryGoodPass\",\n" +
                "    \"name\": \"Georgi Aylov\",\n" +
                "    \"type\": \"STUDENT\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 7,\n" +
                "    \"email\": \"mai@yahoo.com\",\n" +
                "    \"password\": \"pass123654\",\n" +
                "    \"name\": \"Phuong Mai\",\n" +
                "    \"type\": \"STUDENT\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 8,\n" +
                "    \"email\": \"max@tharr.com\",\n" +
                "    \"password\": \"maxTheBest\",\n" +
                "    \"name\": \"Max Tharr\",\n" +
                "    \"type\": \"STUDENT\"\n" +
                "  }\n" +
                "]";
    }

    public static String getSessionsSeed() {
        return "[\n" +
                "  {\n" +
                "    \"startTime\": \"2018-01-12T10:00:00\",\n" +
                "    \"endTime\": \"2018-01-26T00:00:00\",\n" +
                "    \"place\": \"01.07.12\",\n" +
                "    \"sate\": \"PLANNED\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"startTime\": \"2018-01-12T10:00:00\",\n" +
                "    \"endTime\": \"2018-01-26T00:00:00\",\n" +
                "    \"place\": \"01.14.12\",\n" +
                "    \"state\": \"PLANNED\"\n" +
                "  }\n" +
                "]\n";
    }
}
