import {Component} from '@angular/core';
import {MenuController, ModalController, NavController, NavParams} from 'ionic-angular';
import {DetailsView} from '../detail/detail';
import Constants from '../../assets/Constants.json';
import {QRCodeModal} from "../../helpers/qr-code-modal/qr-code";
import {RestAPI} from "../../providers/rest-api";

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
  registeredGroup: object;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public menuCtrl: MenuController,
              public navParams: NavParams,
              private restAPI: RestAPI) {

    //TODO: get lecture info
    this.user = this.navParams.get('user');
    //Currently we only allow a student to be registered in one tutorial group
    if(this.user && this.user.type === this.CONSTANTS.USER_TYPE.STUDENT) {
      this.restAPI.get('users/' + this.user.id +'/groups').subscribe((response) => {
        this.registeredGroup = response;
      });
    } else if(this.user && this.user.type === this.CONSTANTS.USER_TYPE.INSTRUCTOR) {
      this.restAPI.get('groups').subscribe((response) => {
        if(Array.isArray(response)) {
          for(let g = 0; g< response.length; g++) {
            if(response[g].instructor.id === this.user.id) {
              this.registeredGroup = response[g];
            }
          }
        }
      });
    }


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

  //TODO
  startSession() {

  }

  //TODO
  endSession() {

  }

}
