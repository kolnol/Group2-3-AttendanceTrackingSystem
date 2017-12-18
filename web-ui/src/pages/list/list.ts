import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';

import {HomePage} from '../home/home';
import {DetailsView} from '../detail/detail';
import {ListAPI} from '../../providers/list-api';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  selectedItem: any;
  groups: object;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private listAPI: ListAPI) {
    this.listAPI.getData().subscribe((response) => {
      this.groups = response;
      for(let key in this.groups) {
        if(this.groups.hasOwnProperty(key)) {
          this.groups = this.groups[key];
          break;
        }
      }
    });
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
      item: {}
    });
  }
}
