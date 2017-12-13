import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestAPI } from '../../providers/rest-api';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private restAPI: RestAPI) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log("login");
    this.restAPI.getData();
  }
}
