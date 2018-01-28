import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestAPI } from '../../providers/rest-api';
import { NotaryAPI } from '../../providers/notary-api';
import { CryptoService } from '../../../notary/crypto-service';
import { StudentWrapper } from '../../models/student-wrapper';
import { ToastService } from '../../helpers/toast-service';

/**
 * Generated class for the StudentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-students',
  templateUrl: 'students.html',
})
export class StudentsPage {

  session: any;
  students: [StudentWrapper];
  group: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restAPI: RestAPI,
              private notaryAPI: NotaryAPI,
              private cryptoService: CryptoService,
              private toastService: ToastService) {

    this.session = navParams.get("session");
    this.group = navParams.get("group");
    console.log(this.session);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentsPage');
    this.getStudents()
  }

  getStudents() {
    this.restAPI.get('groups/'+ this.group.id + '/students').subscribe(response => {
      let _students = JSON.parse(JSON.stringify(response));
      this.restAPI.get('groups/'+ this.group.id + '/sessions/'+ this.session.id +'/users').subscribe((response) => {
        let attendees = JSON.parse(JSON.stringify(response));
        for(let attendee of attendees) {
          for(let student of _students){
            if(attendee.id == student.id){
              student.present = true;
            }
          }
        }
        this.students = _students;
      });
    })
  }


  verifyStudent(student) {
    let hashedAttendance = this.cryptoService.hash(student.id+this.session.id);
    let result: string;
    this.notaryAPI.get('verifyAttendance?sessionId='+ this.session.id + '&attendance=' + hashedAttendance).subscribe(response => {
      result = JSON.parse(JSON.stringify(response)).result;
      if(result != "confirmed" && result != "denied") {
        this.toastService.presentToast("Session cannot be found!");
      }
      if(result == "confirmed" && student.present) {
        this.toastService.presentToast(student.name + " was present in this session!")
      }

      if(result == "confirmed" && !student.present) {
        this.toastService.presentToast("Mismatch!!!" + student.name + " was present in this session!")
        student.present = true;
      }
      if(result == "denied" && student.present) {
        this.toastService.presentToast("Mismatch!!!" + student.name + " was not present in this session!")
        student.present = false
      }

      if(result == "denied" && !student.present)
        this.toastService.presentToast(student.name + " was not present in this session!")
      })
  }



}
