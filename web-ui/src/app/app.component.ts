import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailsView } from '../pages/detail/detail';
import { RestAPI } from "../providers/rest-api";
import { NotaryService } from '../../notary/notary';
import Constants from '../assets/Constants.json';
import {StudentStatusPage} from "../pages/studentStatus/studentStatus";
import {RequestOptionsArgs} from "@angular/http";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, icon: string, component: any, textColor: string}>;
  user: {
    "id": number,
    "email": string,
    "name": string,
    "password": string,
    "type": string
  };
  textColor: string;
  group: object;
  CONSTANTS: any = Constants;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events, private restAPI: RestAPI,
              public notaryService: NotaryService) {

    this.initializeApp();

    events.subscribe('share user data', (response) => {
      this.user = response;
      //Currently we only allow a student to be registered in one tutorial group
      if(this.user.type === this.CONSTANTS.USER_TYPE.STUDENT) {
        this.restAPI.get('users/' + this.user.id +'/groups',null, this.user).subscribe((response) => {
          this.group = response;
          this.setUpPageMenu();
        });
      } else if(this.user && this.user.type === this.CONSTANTS.USER_TYPE.INSTRUCTOR) {
        this.restAPI.get('groups', null, this.user).subscribe((response) => {
          if(Array.isArray(response) && response.length > 0) {
            for(let i = 0; i < response.length; i++) {
              if(response[i].instructor.id === this.user.id) {
                this.group = response[i];
                break;
              }
            }
          }
        });
      }

    });

    this.setUpPageMenu();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notaryService.connectToPeers(['ws://35.189.84.234:5000/'])
    });
  }

  /**
   * build the menu items
   */
  setUpPageMenu() {
    this.pages = [
      {title: this.CONSTANTS.HOME.TITLE, icon: "home", component: HomePage, textColor: 'primary'}];
    if(!this.group) {
      this.pages.push(
        {title: this.CONSTANTS.LIST.TITLE, icon: "list", component: ListPage, textColor: 'dark'}
        );
    }

    if(this.group) {
      this.pages.push(
        {title: this.CONSTANTS.GROUP_DETAIL.TITLE, icon: "book", component: DetailsView, textColor: 'dark'}
      )
    }

    if(this.user && this.user.type === this.CONSTANTS.USER_TYPE.INSTRUCTOR) {
      this.pages.push({
        title: this.CONSTANTS.STUDENT_STATUS.TITLE, icon: "people", component: StudentStatusPage, textColor: 'dark'
      })
    }

    this.pages.push(
      {title: this.CONSTANTS.LOGOUT.TITLE, icon: "log-out", component: LoginPage, textColor: 'dark'}
    );
  }

  /**
   *
   * @param {{title: string, icon: string, component: object, textColor: string}} page
   */
  openPage(page) {
    page.textColor = 'primary';
    this.resetOtherTextColors(page);
    this.nav.setRoot(page.component, {
      user: this.user,
      group: this.group
    });
  }

  /**
   * reset colors for menu
   * @param {{title: string, icon: string, component: object, textColor: string}} page
   */
  resetOtherTextColors(page) {
    for(let i = 0; i < this.pages.length; i++) {
      if(this.pages[i].title !== page.title) {
        this.pages[i].textColor = 'dark';
      }
    }
  }

  /**
   * Angular sometimes does not recognize an array of objects of ngFor..
   * only currently implemented
   * @param raw - response from server
   * @returns {[]}
   */
  getArray(raw) {
    return Array.from(raw);
  }
}
