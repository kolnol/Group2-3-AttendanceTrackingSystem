import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { HomePage } from "../home/home";
import { RestAPI } from "../../providers/rest-api";

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
              public events: Events,
              private restAPI: RestAPI) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.restAPI.post( 'login',{
      "email": this.username,
      "password": this.password
    }).subscribe((response) => {
      if(response) {
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
