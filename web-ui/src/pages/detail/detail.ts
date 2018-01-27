import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {RestAPI} from "../../providers/rest-api";
import Constants from '../../assets/Constants.json';
import { StudentsPage } from '../students/students';


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
              private restAPI: RestAPI) {

    this.user = this.navParams.get('user');
    this.group = this.navParams.get('group');

    if(this.group.sessions && Array.isArray(this.group.sessions) && this.group.sessions.length > 0) {
      this.firstSession = this.group.sessions[0];
      this.groupWeekDay = this.firstSession.startTime ? this.CONSTANTS.DATE.WEEKDAYS[new Date(this.firstSession.startTime).getDay()]
        : this.CONSTANTS.DATE.TBA;
    }

    let attendances;
    this.restAPI.get('users/'+ this.user.id +'/attendances').subscribe((response) => {
      attendances = response;
      if(Array.isArray(attendances)) {
        for(let at in attendances) {
          if(Object.keys(at).indexOf('id') > 0) {
            this.attendanceIds.push(at['id']);
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
      return sessionDate.getDate()+ '/' + sessionDate.getMonth()+1 + '/' + sessionDate.getFullYear();
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
    if(sessionDate.getHours()>=0 && sessionDate.getMinutes()>=0) {
      return ('0'+sessionDate.getHours()%12).slice(-2) + ':' + ('0'+sessionDate.getMinutes()).slice(-2);
    } else {
      return this.CONSTANTS.DATE.TBA;
    }
  }

  /**
   * Tutor view
   * @param session
   */
  showAllStudents(session){
   this.navCtrl.push(StudentsPage, {
     session: session,
     group: this.group
    })
  }

  /**
   * Student view
   */
  verifyAttendance(){
    //TODO
  }

  /*
  * for calendar implementation which will follow in the next submission
  * currently only list view available
  switchToCalendarView(){
    //...
  }

  switchToListView(){
    //...
  }
   */

}
