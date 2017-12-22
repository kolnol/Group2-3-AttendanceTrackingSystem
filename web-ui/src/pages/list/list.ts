import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';

import {HomePage} from '../home/home';
import {DetailsView} from '../detail/detail';
import {ListAPI} from '../../providers/list-api';
import {RegistrationsApi} from "../../providers/registrations-api";

import Constants from '../../assets/Constants.json';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  selectedItem: any;
  groups: Array<object>;
  firstSession: {id: number, startTime: string, endTime: string, place: string} = {id:0, startTime: 't.b.a.', endTime: 't.b.a.', place: 't.b.a.'};
  registeredId: number; //the id of the users tutorial group
  CONSTANTS: any = Constants;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private listAPI: ListAPI, private registrationsAPI: RegistrationsApi) {
    this.listAPI.getData().subscribe((response) => {
      for(let key in response) {
        if(response.hasOwnProperty(key)) {
          this.groups = response[key];
          let currentGroup;
          for(let i=0; i < this.groups.length; i++) {
            currentGroup = this.groups[i];
            if(currentGroup.sessions) {
              this.firstSession = currentGroup.sessions[0] ? currentGroup.sessions[0] : this.firstSession;
            }
          }

          break;
        }
      }
    });

    this.registrationsAPI.getData().subscribe((response) => {
      for(let key in response) {
        if(response.hasOwnProperty(key)) {
          if(Array.isArray(response[key]) && response[key].length > 0){
            this.registeredId = response[key][0].number ? Number(response[key][0].number) : null;
          }
          break;
        }
      }
    });
  }

  /**
   * extracts the day out of a date string
   * @returns {string} the week day
   */
  getDay():string {
    if(this.firstSession.startTime === 't.b.a.') {
      return 't.b.a.';
    } else {
      let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return weekdays[new Date(this.firstSession.startTime).getDay()];
    }
  }

  getStartTime() {
    if(this.firstSession.startTime === 't.b.a.') {
      return 't.b.a.';
    } else {
      let sessionDate = new Date(this.firstSession.startTime);
      return sessionDate.getHours()%12 + ':' + sessionDate.getMinutes();
    }
  }

  getEndTime() {
    if(this.firstSession.endTime === 't.b.a.') {
      return 't.b.a.';
    } else {
      let sessionDate = new Date(this.firstSession.endTime);
      return sessionDate.getHours()%12 + ':' + sessionDate.getMinutes();
    }
  }

  showDetails(event, item) {
    /* Should any user see the details of a group?
    this.navCtrl.push(DetailsView, {
      item: item
    });
    */
  }

  joinGroup(item) {
    //TODO: pop up and post request, show buttons only if not registered yet as moving group is not possible yet
    this.navCtrl.push(DetailsView, {
      item: item
    });
  }
}
