package de.tum.atse.ats.Utils.Seed;

public class Seed {

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
                "  \"startTime\": \"12-01-2018 10:00:00\",\n" +
                "  \"endTime\": \"24-01-2018 12:00:00\",\n" +
                "  \"place\": \"01.07.12\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"startTime\": \"12-01-2018 10:00:00\",\n" +
                "    \"endTime\": \"12-01-2018 12:00:00\",\n" +
                "    \"place\": \"01.14.12\"\n" +
                "  }\n" +
                "]\n";
    }
}
