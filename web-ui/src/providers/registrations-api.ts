import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RegistrationsApi {
  url: string = "./assets/sample-data/user-id-registrations.json";

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }
}
