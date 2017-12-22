import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { HomePage } from "../home/home";

import Constants from '../../assets/Constants.json';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log("login");
    //TODO: Post request for authentication
    if(this.username && this.password) {
      this.navCtrl.setRoot(HomePage);
    }
  }

  signup() {
    console.log("signup");
    this.navCtrl.push(SignupPage);
  }
}
