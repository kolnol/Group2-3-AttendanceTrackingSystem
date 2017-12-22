import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

/**
 * This api does not exist yet and therefore the sample data will be adapted later
 */

@Injectable()
export class RegistrationsApi {
  url: string = "./assets/sample-data/user-id-registrations.json";//https://atseguestbook-185902.appspot.com/servlet/ ?

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }
}
