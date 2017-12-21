import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UserIdAPI {
  url: string = "./assets/sample-data/user-id.json";

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }
}
