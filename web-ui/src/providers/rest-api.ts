import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";


@Injectable()
export class RestAPI {
  url: string = 'https://atseguestbook-185902.appspot.com/servlet';
  requestoptions: {
    headers: Headers
  };

  constructor(private http: HttpClient) {

  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    /*if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }*/
    if(!reqOpts) {
      reqOpts = this.setHeader(reqOpts, 'get');
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
    if(!reqOpts) {
      reqOpts = this.setHeader(reqOpts, 'post');
    }
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    if(!reqOpts) {
      reqOpts = this.setHeader(reqOpts, 'put');
    }
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    if(!reqOpts) {
      reqOpts = this.setHeader(reqOpts, 'delete');
    }
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    if(!reqOpts) {
      reqOpts = this.setHeader(reqOpts, 'patch');
    }
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  setHeader(user, method) {
    if(user) {
      let headers = new Headers();
      headers.set('Content-Type', 'application/json');
      headers.set('Autorization', 'Basic ' + btoa(user.email + ':' + user.password));
      return {
        headers: headers,
        method: method
      }
    } else {
      return;
    }
  }

}
