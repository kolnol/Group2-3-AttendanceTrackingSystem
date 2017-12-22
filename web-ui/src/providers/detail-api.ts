import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DetailAPI {
  url: string = "./assets/sample-data/user-id-attendance.json"; //https://atseguestbook-185902.appspot.com/servlet/user/{id}/attendances

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }

}
