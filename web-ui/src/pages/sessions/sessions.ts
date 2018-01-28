import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StudentsPage } from '../students/students';
import { DateInterpretter } from '../../models/date-intepretter';


@Component({
  selector: 'page-sessions',
  templateUrl: 'sessions.html',
})
export class SessionsPage {

  sessions: any;
  group:any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.group = navParams.get("group");
    this.sessions = this.group.sessions;
    console.log(JSON.stringify(this.sessions))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessionsPage');
  }

  showStudentsFor(session) {
    this.navCtrl.push(StudentsPage, {
      session: session,
      group: this.group
     })
  }

  formatSession(session) {
    let sessionStartDate = new Date(session.startTime)
    let sessionEndDate = new Date(session.endTime)

    return DateInterpretter.formatDate(sessionStartDate) + " " + 
           DateInterpretter.formatTime(sessionStartDate) + " - " + 
           DateInterpretter.formatTime(sessionEndDate) 
  }

}
