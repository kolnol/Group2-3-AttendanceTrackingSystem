import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DetailsView} from '../detail/detail';
import {RegistrationsApi} from "../../providers/registrations-api";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  registeredGroups: object;

  constructor(public navCtrl: NavController, private registrationsAPI: RegistrationsApi) {
    //TODO: get lecture info
    /*this.registrationsAPI.getData().subscribe((registrations) => {
      this.registeredGroups = registrations;
      for(let key in this.registeredGroups) {
        if(this.registeredGroups.hasOwnProperty(key)) {
          this.registeredGroups = this.registeredGroups[key];
          break;
        }
      }
    });*/
  }

  itemSelected() {
    this.navCtrl.push(DetailsView, {
      item: {}
    });
  }
}
