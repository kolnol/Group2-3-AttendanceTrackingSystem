import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { HomePage } from "../home/home";
import { LoginAPI } from "../../providers/login-api";

import Constants from '../../assets/Constants.json';

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
              public navParams: NavParams,
              public events: Events,
              private loginAPI: LoginAPI) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log("login");
    //TODO: Post request for authentication
   /* if(this.username && this.password) {
      this.navCtrl.setRoot(HomePage);
    }*/
    this.loginAPI.postData({
      "email": this.username,
      "password": this.password
    }).subscribe((response) => {
      if(response) {
        this.wrongDataEntered = false;
        this.events.publish('logged in', response);
        this.navCtrl.setRoot(HomePage, response)
      } else {
        this.wrongDataEntered = true;
      }
    });
  }

  signup() {
    console.log("signup");
    this.navCtrl.push(SignupPage);
  }
}
