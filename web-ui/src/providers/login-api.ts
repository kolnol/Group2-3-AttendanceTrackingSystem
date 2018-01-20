import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LoginAPI {
  url: string = "https://atseguestbook-185902.appspot.com/servlet/login";

  constructor(private http: HttpClient) {

  }

  postData(params) {
    return this.http.post(this.url,params);
  }
}
