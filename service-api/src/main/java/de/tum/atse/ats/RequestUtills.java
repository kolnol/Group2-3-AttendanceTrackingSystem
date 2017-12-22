package de.tum.atse.ats;

import org.restlet.Request;

public class RequestUtills {

    public static String getValue(Request request, String attr) {
        return String.valueOf(request.getAttributes().get(attr));
    }

}
