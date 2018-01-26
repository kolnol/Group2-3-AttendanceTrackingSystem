import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { HomePage } from "../home/home";
import { RestAPI } from "../../providers/rest-api";

import Constants from '../../assets/Constants.json';
import { UserService } from '../../models/user-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;
  CONSTANTS: any = Constants;
  wrongDataEntered: boolean;

  constructor(public navCtrl: NavController,
              public events: Events,
              private restAPI: RestAPI,
              private userService: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.restAPI.post( 'login',{
      "email": this.username.toLowerCase(),
      "password": this.password
    }).subscribe((response) => {
      if(response) {
        this.userService.login(this.username, this.password, response)
        this.wrongDataEntered = false;
        this.events.publish('share user data', response);
        this.navCtrl.setRoot(HomePage, {
          user: response,
          group: {}
        })
      } else {
        this.wrongDataEntered = true;
      }
    });
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}
