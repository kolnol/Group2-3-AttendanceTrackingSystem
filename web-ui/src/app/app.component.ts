import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailsView } from '../pages/detail/detail';

import { UserIdAPI } from "../providers/user-id-api";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, icon: string, component: any, textColor: string}>;
  user: Array<object> = []; //currently implemented as an array

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private userIdAPI: UserIdAPI) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Home', icon: "home", component: HomePage, textColor: "dark"},
      {title: 'List', icon: "list", component: ListPage, textColor: "dark"},
      {title: 'Group details', icon: "book", component: DetailsView, textColor: "dark"},
      {title: 'Logout', icon: "log-out", component: LoginPage, textColor: "dark"}
    ];

    this.userIdAPI.getData().subscribe((userDetails) => {
      this.user.push(userDetails);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  /*
* Angular sometimes does not recognize an array of objects of ngFor..
* only currently implemented
 */
  getArray(raw) {
    return Array.from(raw);
  }
}
