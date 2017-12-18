import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DetailAPI} from '../../providers/detail-api';
import {GroupDetailAPI} from "../../providers/group-detail-api";

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailsView {

  attendances: object;
  group: Array<object> = []; //currently a student can only be registered in one group
  weekdays : Array <string> = [
    "Sunday",  "Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday"
  ];
  groupWeekDay : string;

  constructor(public navCtrl: NavController,
              private groupDetailAPI: GroupDetailAPI,
              private detailAPI: DetailAPI) {

    this.groupDetailAPI.getData().subscribe((details) => {
      this.group.push(details);
    });

    this.detailAPI.getData().subscribe((attendances) => {
      this.attendances = attendances;
      for(let key in this.attendances) {
        if(this.attendances.hasOwnProperty(key)) {
          this.attendances = this.attendances[key];
          break;
        }
      }
    });

    this.groupWeekDay = "Monday"; //this.weekdays[new Date(this.group.sessions[0].begins).getDay()]

    // this.selectedItem = navParams.get('item'); //navigated from list
  }


  /*
  * Angular sometimes does not recognize an array of objects in ngFor..
  * only currently implemented
   */
  getArray(raw) {
    return Array.from(raw);
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
