import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DetailAPI} from '../../providers/detail-api';
import {GroupDetailAPI} from "../../providers/group-detail-api";
import Constants from '../../assets/Constants.json';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailsView {

  attendanceIds: Array<number> = []; //contains the ids of the sessions the logged in user visited
  group: Array<object> = []; //currently a student can only be registered in one group
  weekdays: Array<string> = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  groupWeekDay: string;
  CONSTANTS: any = Constants;
  sessions: Array<{
    id: number,
    startTime: string,
    endTime: string,
    place: string
  }>;
  //we define a first session which represents the weekly time data for the group in the detail.html
  firstSession: {
    id: number,
    startTime: string,
    endTime: string,
    place: string
  };

  constructor(public navCtrl: NavController,
              private groupDetailAPI: GroupDetailAPI,
              private detailAPI: DetailAPI) {

    this.groupDetailAPI.getData().subscribe((details) => {
      this.group.push(details);
      for(let i= 0; i < this.group.length; i++) {
        for(let key in this.group[i]) {
          if(this.group[i].hasOwnProperty(key) && key === 'sessions') {
            this.sessions = this.group[i][key];
            if(this.sessions[0]) {
              this.firstSession = this.sessions[0];
              this.groupWeekDay = this.firstSession.startTime ? this.weekdays[new Date(this.firstSession.startTime).getDay()]
                : 't.b.a.';
            }
            break;
          }
        }
      }
    });

    let attendances = [];
    this.detailAPI.getData().subscribe((attendancesRaw) => {
      for (let key in attendancesRaw) {
        if (attendancesRaw.hasOwnProperty(key)) {
          attendances = attendancesRaw[key];
          for(let i = 0; i < attendances.length; i++) {
            if(attendances[i].sessionId) {
              this.attendanceIds.push(attendances[i].sessionId);
            }
          }
          break;
        }
      }
    });

    // this.selectedItem = navParams.get('item'); //navigated from list
  }


  /**
   * Angular sometimes does not recognize an array of objects in ngFor..
   * only currently implemented
   * @param raw - the response of the server
   * @returns {[]}
   */
  getArray(raw) {
    return Array.from(raw);
  }

  getSessionDate(sessionStartTime){
    if(!sessionStartTime) {
      return 't.b.a.';
    } else {
      let sessionDate = new Date(sessionStartTime);
      return sessionDate.getMonth() + '/' +sessionDate.getDate()+ '/' + sessionDate.getFullYear();
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
