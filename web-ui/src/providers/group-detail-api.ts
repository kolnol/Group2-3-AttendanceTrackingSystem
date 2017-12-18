import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GroupDetailAPI {
  url: string = "./assets/sample-data/group-id.json";

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }

}
