package AttendanceToken;

import javax.crypto.*;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

public class DesAttendanceTokenGenerator implements AttendanceTokenGenerator {

    private SecretKey secretKey;
    private Cipher desCipher;
    private final DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");

    public DesAttendanceTokenGenerator(
                                       String algorithm,
                                       String mode,
                                       String paddingScheme) throws NoSuchAlgorithmException,
            NoSuchPaddingException {
        this.secretKey = KeyGenerator.getInstance(algorithm).generateKey();
        this.desCipher = Cipher.getInstance(algorithm + "/" + mode + "/" + paddingScheme);
    }


    public String generate(Long sessionId, Long studentId, Date timestamp) {
        try {
            byte[] token = (sessionId + "/" + studentId + "/" + dateFormat.format(timestamp)).getBytes("UTF-8");
            token = encryptToken(token);
            return convertTokenToString(token);


        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private byte[] encryptToken(byte[] token) throws InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        desCipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return desCipher.doFinal(token);
    }

    private String convertTokenToString(byte[] token) {
        return Base64.getEncoder().encodeToString(token);
    }

    public Attendance decode(String attendanceToken) {
        try {
            byte[] token = convertStringToToken(attendanceToken);
            token = decryptToken(token);

            String decryptedToken = new String(token);
            String[] tokenData = formatToken(decryptedToken);
            if(tokenData == null) {
                return null;
            }

            return createAttendanceFromTokenData(tokenData);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }

        return null;
    }

    private byte[] convertStringToToken(String attendanceToken) {
        return Base64.getDecoder().decode(attendanceToken);
    }

    private byte[] decryptToken(byte[] token) throws BadPaddingException, IllegalBlockSizeException, InvalidKeyException {
        desCipher.init(Cipher.DECRYPT_MODE, secretKey);
        return desCipher.doFinal(token);
    }

    private String[] formatToken(String decryptedToken) {
        String[] tokenData = decryptedToken.split("/");
        if(isTokenValid(tokenData)) {
            return tokenData;
        }
        return null;
    }

    private boolean isTokenValid(String[] tokenData) {
        return tokenData.length == 3;
    }

    private Attendance createAttendanceFromTokenData(String[] tokenData) {
        try {
            Long studentId = Long.parseLong(tokenData[0]);
            Long sessionId = Long.parseLong(tokenData[1]);
            Date timestamp = stringToDate(tokenData[2]);

            return new Attendance(studentId, sessionId, timestamp);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

    }

    private Date stringToDate (String timestamp) throws ParseException {
        return dateFormat.parse(timestamp);
    }
}
