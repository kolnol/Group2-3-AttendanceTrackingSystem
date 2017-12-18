import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ListAPI {
  url: string = "./assets/sample-data/groups.json";

  constructor(private http: HttpClient) {

  }

  getData() {
    return this.http.get(this.url);
  }
}
