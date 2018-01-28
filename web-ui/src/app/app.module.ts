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
import { NotaryService } from '../../notary/notary-service';
import { CryptoService } from '../../notary/crypto-service';
import { NotaryAPI } from '../providers/notary-api';
import { UserService } from '../models/user-service';
import { StudentsPage } from '../pages/students/students';
import {StudentStatusPage} from "../pages/studentStatus/studentStatus";
import { SessionsPage } from '../pages/sessions/sessions';
import { ToastService } from '../helpers/toast-service';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    DetailsView,
    StudentsPage,
    StudentStatusPage,
    QRCodeModal,
    SessionsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    QRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    HomePage,
    ListPage,
    DetailsView,
    StudentsPage,
    StudentStatusPage,
    QRCodeModal,
    SessionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    RestAPI,
    NotaryService,
    NotaryAPI,
    UserService,
    CryptoService,
    ToastService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
