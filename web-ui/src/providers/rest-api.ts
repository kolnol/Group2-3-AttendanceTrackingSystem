import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";



@Injectable()
export class RestAPI {
    url: string = "./assets/sample.json"
    
    constructor(private http: HttpClient) {

    }

    getData() {
        this.http.get(this.url).subscribe((response) => {
            console.log(JSON.stringify(response));
        })
    }
}