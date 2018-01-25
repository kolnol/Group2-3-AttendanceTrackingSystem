package de.tum.atse.ats.Utils;

import org.jasypt.util.text.BasicTextEncryptor;

public class AttendanceTokenEncryptor {
    private static final String password = "hirwufbwwlefhiwbfiuqewrfw[f'wef;w";

    public static String encodeToken(Long studentId, Long sessionId) {
        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword(password);
        return encryptor.encrypt(studentId+sessionId+"");
    }

    public static String decodeToken(String token) {
        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword(password);
        return encryptor.decrypt(token);
    }
}
