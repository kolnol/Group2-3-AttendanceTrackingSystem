import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpHeaders} from "@angular/common/http";
import { UserService } from "../models/user-service";


@Injectable()
export class RestAPI {
  url: string = 'https://atseguestbook-185902.appspot.com/servlet';

  username: string;
  password: string;

  constructor(private http: HttpClient,
              private userService: UserService) {

  }
  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa(this.userService.authorization)); 
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
        headers: headers
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }
    

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);

    reqOpts = { headers: headers };
    
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    reqOpts = { headers: headers };
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    reqOpts = { headers: headers };
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    reqOpts = { headers: headers };
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

}
