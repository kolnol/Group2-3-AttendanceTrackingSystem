import {Component} from '@angular/core';
import {MenuController, ModalController, NavController, NavParams} from 'ionic-angular';
import {DetailsView} from '../detail/detail';
import {ListPage} from "../list/list";
import {StudentStatusPage} from "../studentStatus/studentStatus";
import Constants from '../../assets/Constants.json';
import {QRCodeModal} from "../../helpers/qr-code-modal/qr-code";
import {RestAPI} from "../../providers/rest-api";
import { NotaryService } from '../../../notary/notary-service';
import { NotaryAPI } from '../../providers/notary-api';
import { GroupWrapper } from '../../models/group';
import { DateInterpretter } from '../../models/date-intepretter';
import { SessionsPage } from '../sessions/sessions';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: {
    id: number,
    email: string,
    name: string,
    password: string,
    type: string
  };
  CONSTANTS: any = Constants;
  sessions: any;
  currentSession: any;
  registeredGroup = {
    id: null,
    number: null,
    instructor: {},
    sessions: [],
    students: [],
    attendances: []
  };
  started: boolean = false;
  sessionButtonCaption = "Start session";
  groups: [GroupWrapper];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public menuCtrl: MenuController,
              public navParams: NavParams,
              private restAPI: RestAPI,
              private notaryAPI: NotaryAPI) {

    //TODO: get lecture info
    this.user = this.navParams.get('user');
    //Currently we only allow a student to be registered in one tutorial group
    if(this.user && this.user.type === this.CONSTANTS.USER_TYPE.STUDENT) {
      this.restAPI.get('users/' + this.user.id +'/groups').subscribe((response) => {
        if(response) {
          for(let key in response) {
            if (response.hasOwnProperty(key)) {
              this.registeredGroup[key] = response[key];
            }
          }
        }
      });
    } else if(this.user && this.user.type === this.CONSTANTS.USER_TYPE.INSTRUCTOR) {
        this.restAPI.get('groups').subscribe((response) => {
          if(Array.isArray(response)) {
            for(let g = 0; g< response.length; g++) {
              if(response[g].instructor.id === this.user.id) {
                this.registeredGroup = response[g];
                let newGroup: GroupWrapper = response[g];
                newGroup.sessionButtonCaption = "Start session";
                newGroup.buttonColor = 'green';
                this.restAPI.get('groups/'+ response[g].id + '/sessions').subscribe((response) => {
                  this.sessions = response;
                  this.findCurrentSession(newGroup, this.sessions);
                  if(this.groups)
                    this.groups.push(newGroup);
                  else {
                    this.groups = [newGroup];
                  }
                });
              }
            }
          }
        });
    }


  }

  findCurrentSession(group, sessions) {
    sessions.forEach(session => {
      let startTime = new Date(session.startTime);
      let endTime = new Date(session.endTime);
      if(startTime.getTime() <= Date.now() && endTime.getTime() >= Date.now()){
        this.currentSession = session;
        group.currentSession = session;
      }
    })
  }

  /**
   * both tutor and student view
   */
  showGroupDetails() {
    this.navCtrl.push(DetailsView, {
      user: this.user,
      group: this.registeredGroup
    });
  }

  getDay(session) {
    if(!session) return "Saturday"
    let sessionDate = new Date(session.startTime);
    return DateInterpretter.getDay(sessionDate.getDay())
  }

  getTimeslot(session) {
    if(!session) return "t.b."
    let sessionStartDate = new Date(session.startTime);
    let sessionEndDate = new Date(session.endTime);

    return this.formatTime(sessionStartDate) + " - " + this.formatTime(sessionEndDate )
  }

  formatTime(date) {
    return DateInterpretter.formatTime(date)
  }

  getNextQRCode() {
    let qrCodeText;
    this.restAPI.get('attendanceToken/' + this.user.id).subscribe((response) => {
      console.log(response);
      qrCodeText = response;
      if(qrCodeText) {
        let qrCodeModal = this.modalCtrl.create(QRCodeModal, {value: qrCodeText.token ? qrCodeText.token: null});
        qrCodeModal.present();
      }
    });
  }

  /**
   * Tutor view
   */
  startSession(group) {
    if(!group.currentSession) return;
    let sth =this.notaryAPI.post('addSession', {
      "sessionId": group.currentSession.id,
      "state": "begin"
    }).subscribe(response => {
      console.log(response)
    });
    group.sessionStarted = !group.sessionStarted;
    group.sessionButtonCaption = "Stop session";
    group.buttonColor = "primary";
  }

  /**
   * Tutor view
   */
  endSession(group) {
    if(!group.currentSession) return;
    let sth =this.notaryAPI.post('addSession', {
      sessionId: group.currentSession.id,
      state: "end"
    }).subscribe(response => {
      console.log(response)
    });
    group.sessionStarted = !group.sessionStarted;
    group.sessionButtonCaption = "Start session";
    group.buttonColor = "green";
  }

  /**
   * Student view
   */
  navigateToGroupList(){
    this.navCtrl.push(ListPage, {
      user: this.user,
      group: this.registeredGroup
    })
  }

  /**
   * Tutor view
   * navigates to global student status view
   */
  goToStudentAbsences(group) {
    this.navCtrl.push(StudentStatusPage,{
      user: this.user,
      group: group
    })
  }

  goToSessions(group) {
    this.navCtrl.push(SessionsPage,{
      sessions: group.sessions,
      group: group
    })
  }
}
