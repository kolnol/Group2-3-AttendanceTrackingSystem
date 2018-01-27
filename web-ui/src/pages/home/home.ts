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
                this.restAPI.get('groups/'+ this.registeredGroup.id + '/sessions').subscribe((response) => {
                  this.sessions = response;
                  this.findCurrentSession(this.sessions);
                });
              }
            }
          }
        });
    }


  }

  findCurrentSession(sessions) {
    sessions.forEach(session => {
      let startTime = new Date(session.startTime);
      let endTime = new Date(session.endTime);
      if(startTime.getTime() <= Date.now() && endTime.getTime() >= Date.now()){
        this.currentSession = session;
        console.log("Current session found: " + this.currentSession);
        return;
      }
    })
  }

  showGroupDetails() {
    this.navCtrl.setRoot(DetailsView, {
      user: this.user,
      group: this.registeredGroup
    });
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

  startSession() {
    let sth =this.notaryAPI.post('addSession', {
      "sessionId": this.currentSession,
      "state": "begin"
    }).subscribe(response => {
      console.log(response)
    })
    this.started = !this.started;
    this.sessionButtonCaption = "Stop session";
  }

  endSession() {
    let sth =this.notaryAPI.post('addSession', {
      sessionId: this.currentSession,
      state: "end"
    }).subscribe(response => {
      console.log(response)
    })
    this.started = !this.started;
    this.sessionButtonCaption = "Start session";
  }

  /**
   * Student view
   */
  navigateToGroupList(){
    this.navCtrl.setRoot(ListPage, {
      user: this.user,
      group: this.registeredGroup
    })
  }

  /**
   * Tutor view
   */
  showStudentStatus() {
    this.navCtrl.setRoot(StudentStatusPage,{
      user: this.user,
      group: this.registeredGroup
    })
  }
}
