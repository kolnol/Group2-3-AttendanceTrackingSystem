import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestAPI } from '../../providers/rest-api';
import { NotaryAPI } from '../../providers/notary-api';
import { CryptoService } from '../../../notary/crypto-service';

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
  students: any;
  group: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private restAPI: RestAPI,
              private notaryAPI: NotaryAPI,
              private cryptoService: CryptoService) {

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
      this.students = response;
    })
  }

  verifyStudent(student) {
    console.log("clicked " + student)
    let hashedAttendance = this.cryptoService.hash(student.id+this.session.id);

    this.notaryAPI.get('verifyAttendance?sessionId='+ "1" + '&attendance=' + "ye").subscribe(response => {
      console.log("Verification: " + JSON.stringify(response));
    })
  }



}
