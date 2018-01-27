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
  weekdays: Array<string> = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
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
      this.groupWeekDay = this.firstSession.startTime ? this.weekdays[new Date(this.firstSession.startTime).getDay()]
        : 't.b.a.';
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

  getSessionDate(sessionStartTime){
    if(!sessionStartTime) {
      return 't.b.a.';
    } else {
      let sessionDate = new Date(sessionStartTime);
      return sessionDate.getDate()+ '/' + sessionDate.getMonth()+1 + '/' + sessionDate.getFullYear();
    }
  }

  /**
   * gets a valid start time
   * @param {?string} sessionStartTime
   * @returns {string}
   */
  getStartTime(sessionStartTime) {
    if(!sessionStartTime) {
      return 't.b.a.';
    } else {
      let sessionDate = new Date(sessionStartTime);
      return sessionDate.getHours()%12 + ':' + sessionDate.getMinutes();
    }
  }

  /**
   * gets a valid end time
   * @param {?string} sessionEndTime
   * @returns {string}
   */
  getEndTime(sessionEndTime) {
    if(!sessionEndTime) {
      return 't.b.a.';
    } else {
      let sessionDate = new Date(sessionEndTime);
      return sessionDate.getHours()%12 + ':' + sessionDate.getMinutes();
    }
  }

  /**
   * Tutor view
   */
  showAllStudents(session){
    console.log(session);
   //TODO: Georgi add list
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
