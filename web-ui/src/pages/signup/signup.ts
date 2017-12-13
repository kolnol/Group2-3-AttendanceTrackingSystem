import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  firstname: string;
  lastname: string;
  email: string;
  enrollmentNumber: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signup() {
    console.log("signup")
    console.log(this.firstname? this.firstname : "nothing");
    this.navCtrl.push(LoginPage);
  }

}
