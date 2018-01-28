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
  email: string;
  firstname: string;
  lastname: string;
  step: string;
  CONSTANTS: any = Constants;
  wrongDataEntered: boolean = false;
  missingData: boolean = false;
  missingDataText: string = "Please fill in all fields!";

  constructor(public navCtrl: NavController,
              public events: Events,
              private restAPI: RestAPI,
              private userService: UserService) {
    this.step = "login";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    if(!this.username || !this.password) {
      this.wrongDataEntered = true;
      return;
    }
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
    if(!this.email || !this.password || !this.firstname || !this.lastname){
      this.missingDataText = "Please fill in all fields!";
      this.missingData = true;
      return
    }
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(!pattern.test(this.email)) {
      this.missingDataText = "Please enter valid email address!"
      this.missingData = true;
      return;
    }
    
    let newUser = {
      "email": this.email,
      "password": this.password,
      "name": this.firstname + " "+ this.lastname,
      "type": "STUDENT"
    };
    this.restAPI.post('users', newUser,{}).subscribe((response)=>{
      console.log(response);
    });
    this.step = "login"
  }
}
