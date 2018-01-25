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
import { RestAPI } from "../providers/rest-api";
import { QRCodeModal } from "../helpers/qr-code-modal/qr-code";
import { QRCodeModule } from 'angular2-qrcode';
import { NotaryService } from '../../notary/notary';
import { NotaryAPI } from '../providers/notary-api';
import { UserService } from '../models/user-service';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    DetailsView,
    QRCodeModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    QRCodeModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    DetailsView,
    QRCodeModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    RestAPI,
    NotaryService,
    NotaryAPI,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
