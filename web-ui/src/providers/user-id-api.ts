import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UserIdAPI {
  url: string = "./assets/sample-data/user-id.json"; //https://atseguestbook-185902.appspot.com/servlet/user/{id}

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }
}
