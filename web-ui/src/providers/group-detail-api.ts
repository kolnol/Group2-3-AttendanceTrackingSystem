import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GroupDetailAPI {
  url: string = "./assets/sample-data/group-id.json";//https://atseguestbook-185902.appspot.com/servlet/group/{id]

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }

}
