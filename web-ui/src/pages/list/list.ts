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
  groups: Array<{
    id: number,
    number: string,
    instructor: {
      id: number,
      email: string,
      name: string,
      password: string,
      type: string
    },
    sessions: Array <{
      id: number,
      startTime: string,
      endTime: string,
      place: string
    }>,
    students: Array<{
      id: number,
      email: string,
      name: string,
      password: string,
      type: string
    }>,
    attendances: Array<{
      studentId: number,
      sessionId: number,
      timestamp: string
    }>
  }>;
  registeredGroupNumber: number;
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private restAPI: RestAPI) {

    this.user = this.navParams.get('user');

    this.restAPI.get('groups').subscribe((response) => {
      if(Array.isArray(response)) {
        this.groups = response;
      }
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
      return this.CONSTANTS.DATE.WEEKDAYS[new Date(group.sessions[0].startTime).getDay()];
    } else {
      return this.CONSTANTS.DATE.TBA;
    }
  }

  /**
   * extracts the start time out of a date string
   * @returns {string} the start time of the weekly sessions
   */
  getStartTime(group) {
    if (group.sessions && group.sessions[0]) {
      let sessionDate = new Date(group.sessions[0].startTime);

      return this.getTime(sessionDate);
    } else {
      return this.CONSTANTS.DATE.TBA;
    }
  }

  /**
   * extracts the end time out of a date string
   * @returns {string} the end time of the weekly sessions
   */
  getEndTime(group) {
    if (group.sessions && group.sessions[0]) {
      let sessionDate = new Date(group.sessions[0].endTime);
      return this.getTime(sessionDate);

    } else {
      return this.CONSTANTS.DATE.TBA;
    }
  }

  getTime(sessionDate: Date) {
    if(sessionDate.getHours()>=0 && sessionDate.getMinutes()>=0) {
      return sessionDate.getHours()%12 + ':' + sessionDate.getMinutes();
    } else {
      return this.CONSTANTS.DATE.TBA;
    }
  }

  /**
   * For tutor view
   * shows details of a group
   * @param group
   */
  showDetails(group) {
    this.navCtrl.setRoot(DetailsView, {
      user: this.user,
      group: group
    });
  }

  /**
   * For student view
   * handles joining with request to the server
   * @param group
   */
  joinGroup(group) {
    let alert;
    if(this.registeredGroupNumber) {
      //this alert is implemented for the feature: student can move group
      //this feature may be implemented later in the future
      alert = this.alertCtrl.create({
        title: this.CONSTANTS.LIST.JOINING_NOT_POSSIBLE,
        message: this.CONSTANTS.LIST.ALREADY_REGISTERED,
        buttons: [
          {
            text: this.CONSTANTS.LIST.OK,
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
    } else {
      alert = this.alertCtrl.create({
        title: this.CONSTANTS.LIST.CONFIRM,
        message: this.CONSTANTS.LIST.REGISTER_CONFIRM + '?',
        buttons: [
          {
            text: this.CONSTANTS.LIST.CANCEL,
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: this.CONSTANTS.LIST.JOIN,
            handler: () => {
              this.restAPI.put('groups/'+ group.id + '/students/' + this.user.id, null).subscribe((response) => {
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
