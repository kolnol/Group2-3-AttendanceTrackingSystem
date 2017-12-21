import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailsView } from '../pages/detail/detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ListAPI } from '../providers/list-api';
import { DetailAPI } from '../providers/detail-api';
import { GroupDetailAPI } from '../providers/group-detail-api';
import { UserIdAPI } from "../providers/user-id-api";
import { RegistrationsApi } from "../providers/registrations-api";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    DetailsView
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    DetailsView
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    ListAPI,
    DetailAPI,
    GroupDetailAPI,
    UserIdAPI,
    RegistrationsApi,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
