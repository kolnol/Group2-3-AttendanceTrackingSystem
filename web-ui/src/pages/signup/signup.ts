import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestAPI } from "../../providers/rest-api";
import Constants from '../../assets/Constants.json';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  firstname: string;
  lastname: string;
  email: string;
  enrollmentNumber: string; //TODO: check this
  password: string;
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private restAPI: RestAPI) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signup() {
    let newUser = {
      "email": this.email,
      "password": this.password,
      "name": this.firstname + " "+ this.lastname,
      "type": "STUDENT"
    };
    this.restAPI.post('users', newUser,{}).subscribe((response)=>{
      console.log(response);
    });
    this.navCtrl.push(LoginPage);
  }

}
