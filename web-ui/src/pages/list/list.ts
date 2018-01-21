import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Nav, AlertController} from 'ionic-angular';

import {HomePage} from '../home/home';
import {DetailsView} from '../detail/detail';
import {RestAPI} from "../../providers/rest-api";

import Constants from '../../assets/Constants.json';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  user: {
    id: number,
    email: string,
    name: string,
    password: string,
    type: string
  };
  selectedItem: any;
  groups: object;
  registeredGroupNumber: number;
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private restAPI: RestAPI) {

    this.user = this.navParams.get('user');

    this.restAPI.get('groups').subscribe((response) => {
      this.groups = response;
    });

    let group;
    //Currently we only allow a student to be registered in one tutorial group
    this.restAPI.get('users/' + this.user.id +'/groups').subscribe((response) => {
      group = response;
      if(group) {
        this.registeredGroupNumber = group.number ? group.number : null;
      }
    });
  }

  /**
   * extracts the day out of a date string
   * @returns {string} the week day of the weekly sessions
   */
  getDay(group): string {
    if (group.sessions && group.sessions[0]) {
      let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return weekdays[new Date(group.sessions[0].startTime).getDay()];
    } else {
      return 't.b.a.';
    }
  }

  /**
   * extracts the start time out of a date string
   * @returns {string} the start time of the weekly sessions
   */
  getStartTime(group) {
    if (group.sessions && group.sessions[0]) {
      let sessionDate = new Date(group.sessions[0].startTime);
      if(sessionDate.getHours() && sessionDate.getMinutes()) {
        return sessionDate.getHours() % 12 + ':' + sessionDate.getMinutes();
      }
      return 't.b.a.';
    } else {
      return 't.b.a.';
    }
  }

  /**
   * extracts the end time out of a date string
   * @returns {string} the end time of the weekly sessions
   */
  getEndTime(group) {
    if (group.sessions && group.sessions[0]) {
      let sessionDate = new Date(group.sessions[0].endTime);
      if(sessionDate.getHours() && sessionDate.getMinutes()) {
        return sessionDate.getHours() % 12 + ':' + sessionDate.getMinutes();
      }
      return 't.b.a.';
    } else {
      return 't.b.a.';
    }
  }

  //optional feature which could be implemented if time is left
  showDetails(event, item) {
    /* Should any user see the details of a group?
    this.navCtrl.push(DetailsView, {
      item: item
    });
    */
  }

  /**
   * handles joining with request to the server
   */
  joinGroup(group) {
    //TODO: pop up and post request, show buttons only if not registered yet as moving group is not possible yet
    let alert;
    if(this.registeredGroupNumber) {
      alert = this.alertCtrl.create({
         title: 'Joining not possible.',
         message: 'You are already registered in a tutorial group.',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
    } else {
      alert = this.alertCtrl.create({
        title: 'Confirm join',
        message: 'Do you want to join this tutorial group?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Join',
            handler: () => {
              this.restAPI.put('groups/'+ group.id + '/students/' + this.user.id, {}).subscribe((response) => {
                console.log(response);
                }
              );
              this.navCtrl.setRoot(DetailsView, {
                user: this.user,
                group: group
              });
            }
          }
        ]
      });
    }
    alert.present();
  }

}
