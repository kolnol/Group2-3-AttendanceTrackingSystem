import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {RestAPI} from "../../providers/rest-api";
import Constants from '../../assets/Constants.json';
import { SessionsPage } from '../sessions/sessions';
import { CryptoService } from '../../../notary/crypto-service';
import { NotaryAPI } from '../../providers/notary-api';
import { ToastService } from '../../helpers/toast-service';
import { DateInterpretter } from "../../models/date-intepretter";
import {DateFormatter} from "@angular/common/src/pipes/deprecated/intl";

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailsView {

  user: {
    id: number,
    email: string,
    name: string,
    password: string,
    type: string
  };
  attendanceIds: Array<number> = []; //contains the ids of the sessions the logged in user visited
  group: {
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
      place: string,
      present: boolean
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
  };
  groupWeekDay: string;
  //we define a first session which represents the weekly time data for the group in the detail.html
  firstSession: {
    id: number,
    startTime: string,
    endTime: string,
    place: string
  };
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController,
              public navParams : NavParams,
              private restAPI: RestAPI,
              private cryptoService: CryptoService,
              private notaryAPI: NotaryAPI,
              private toastService: ToastService) {

    this.user = this.navParams.get('user');
    this.group = this.navParams.get('group');

    if(this.group.sessions && Array.isArray(this.group.sessions) && this.group.sessions.length > 0) {
      this.firstSession = this.group.sessions[0];
      let sessionDate = new Date(this.firstSession.startTime);
      this.groupWeekDay = DateInterpretter.getDay(sessionDate.getDay()) ? DateInterpretter.getDay(sessionDate.getDay())
        : this.CONSTANTS.DATE.TBA;
    }

    let attendances;
    this.restAPI.get('users/'+ this.user.id +'/attendances').subscribe((response) => {
      attendances = response;
      console.log(JSON.stringify(response));

      for(let attendance of attendances) {
        this.attendanceIds.push(attendance.sessionId)
      }

      for(let session of this.group.sessions) {
        console.log(session.id);
        for(let attendance of attendances) {
          if(attendance.sessionId == session.id) {
            console.log("yes");
            session.present = true;
          } else {
            console.log("no");
            session.present = false;
          }
        }

      }
    });
  }

  /**
   * gets a valid date
   * @param {!string} sessionStartTime - raw time string from the server
   * @returns {string}
   */
  getSessionDate(sessionStartTime){
    if(!sessionStartTime) {
      return this.CONSTANTS.DATE.TBA;
    } else {
      let sessionDate = new Date(sessionStartTime);
      return DateInterpretter.formatDate(sessionDate);
    }
  }

  /**
   * gets a valid start time
   * @param {?string} sessionStartTime - raw time string from the server
   * @returns {string}
   */
  getStartTime(sessionStartTime) {
    if(!sessionStartTime) {
      return this.CONSTANTS.DATE.TBA;
    } else {
      let sessionDate = new Date(sessionStartTime);
      return this.getTime(sessionDate);
    }
  }

  /**
   * gets a valid end time
   * @param {?string} sessionEndTime - raw time string from the server
   * @returns {string}
   */
  getEndTime(sessionEndTime) {
    if(!sessionEndTime) {
      return this.CONSTANTS.DATE.TBA;
    } else {
      let sessionDate = new Date(sessionEndTime);
      return this.getTime(sessionDate);
    }
  }

  /**
   * parses the string for displaying the time
   * @param {Date} sessionDate
   * @returns {string} the parsed time string
   */
  getTime(sessionDate: Date) {
    return DateInterpretter.formatTime(sessionDate);
  }

  /**
   * Tutor view
   * @param session
   */
  showAllStudents(session){
    console.log(session);
    this.navCtrl.push(SessionsPage, {
      sessions: this.group.sessions,
      group: this.group
     })
  }



  /**
   * Student view
   */
  verifyAttendance(session){
    let hashedAttendance = this.cryptoService.hash(String(this.user.id) + String(session.id));
    console.log("generated hash: "+ hashedAttendance);
    let result: string;
    this.notaryAPI.get('verifyAttendance?sessionId='+ session.id + '&attendance=' + hashedAttendance).subscribe(response => {
      result = JSON.parse(JSON.stringify(response)).result;
      if(result != "confirmed" && result != "denied") {
        this.toastService.presentToast("Session cannot be found!");
      }
      if(result == "confirmed" && session.present)
        this.toastService.presentToast(this.user.name + " was present in this session!")

      if(result == "confirmed" && !session.present) {
        this.toastService.presentToast("Mismatch!!!" + this.user.name + " was present in this session!")
        session.present = true;
      }

      if(result == "denied" && session.present) {
        this.toastService.presentToast("Mismatch!!!" + this.user.name + " was not present in this session!")
        session.present = false;
      }

      if(result == "denied" && !session.present)
        this.toastService.presentToast(this.user.name + " was not present in this session!")

      })
  }

}
