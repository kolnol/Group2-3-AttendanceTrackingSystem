package de.tum.atse.ats.Utils.AttendanceToken;

import de.tum.atse.ats.Entity.Attendance;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.apache.commons.codec.binary.Base64;

import java.util.Arrays;
import java.util.Date;


// TODO Make it singleton and remove secret from db
public class DesAttendanceTokenGenerator implements AttendanceTokenGenerator {
    private final String KEY = "okbhosuigfüb368&%dubcpiezr";
    private SecretKey secretKey;
    private Cipher desCipher;
    private final DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
    private Base64 base64 = new Base64();

    public DesAttendanceTokenGenerator(
                                       String algorithm,
                                       String mode,
                                       String paddingScheme) {
        byte[] key = new byte[0];
        try {
            key = KEY.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        MessageDigest sha = null;
        try {
            sha = MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        key = sha.digest(key);
        key = Arrays.copyOf(key, 16); // use only first 128 bit
        this.secretKey = new SecretKeySpec(key, algorithm);

        try {
            this.desCipher = Cipher.getInstance(algorithm + "/" + mode + "/" + paddingScheme);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
            e.printStackTrace();
        }
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }

    public String generate(Long sessionId, Long studentId, Date timestamp) {
        try {
            String token = sessionId + "/" + studentId + "/" + dateFormat.format(timestamp);
            return encrypt(token);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public String encrypt(String token) {
        String result = "";
        try {
            desCipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] utf8 = token.getBytes("UTF8");
            byte[] encryptedData = desCipher.doFinal(utf8);

            System.out.println("--------------------------------------");
            System.out.println("Encrypted Data:" + Arrays.toString(encryptedData));
            System.out.println("Key:" + Arrays.toString(secretKey.getEncoded()));
            System.out.println("--------------------------------------");

            result = base64.encodeToString(encryptedData);//this.b64Encoder.encode(encryptedData);
        }
        catch (InvalidKeyException oException) { 			oException.printStackTrace(); }
        catch (IllegalBlockSizeException oException) { 		oException.printStackTrace(); }
        catch (BadPaddingException oException) { 			oException.printStackTrace(); }
        catch (IOException oException) { 					oException.printStackTrace(); }
        return result;
    }

    private byte[] encryptToken(byte[] token) throws InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        desCipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return desCipher.doFinal(token);
    }

    private String convertTokenToString(byte[] token) {
        return base64.encodeToString(token);
    }

    public Attendance decode(String attendanceToken) {
        //byte[] token = convertStringToToken(attendanceToken);

        String decryptedToken = decrypt(attendanceToken, secretKey);
        String[] tokenData = formatToken(decryptedToken);
        if(tokenData == null) {
            return null;
        }

        return createAttendanceFromTokenData(tokenData);
    }

    private byte[] convertStringToToken(String attendanceToken) {
        return base64.decode(attendanceToken);
    }

    public String decrypt(String token, SecretKey secretKey) {
        String result = "";
        try {
            desCipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decodedData = base64.decode(token);//this.b64Decoder.decodeBuffer(aData);
            System.out.println("--------------------------------------");
            System.out.println("Encrypted Data:" + Arrays.toString(decodedData));
            System.out.println("Key:" + Arrays.toString(secretKey.getEncoded()));
            System.out.println("--------------------------------------");
            byte[] utf8 = desCipher.doFinal(decodedData);
            result = new String(utf8, "UTF8");
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        return result;
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
            Long studentId = Long.parseLong(tokenData[1]);
            Long sessionId = Long.parseLong(tokenData[0]);
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
