import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
    _user: any;
    authorization: any;

    constructor() {
        
    }

    login(username, password, response) {
        this.authorization = username + ":" + password;
        this._user = response;
        
    }

    isLoggedIn() {
        return this._user;
    }

    logOut() {
        this._user = null;
    }

}