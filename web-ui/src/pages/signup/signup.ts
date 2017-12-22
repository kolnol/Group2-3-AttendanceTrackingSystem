import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import Constants from '../../assets/Constants.json';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  firstname: string;
  lastname: string;
  email: string;
  enrollmentNumber: string;
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signup() {
    //TODO: REST requests
    console.log("signup");
    this.navCtrl.push(LoginPage);
  }

}
