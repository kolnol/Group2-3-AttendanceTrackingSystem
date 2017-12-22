import {Component} from "@angular/core";
import {MenuController, NavParams, ViewController} from 'ionic-angular';

@Component({
  templateUrl: 'qr-code.html'
})

export class QRCodeModal {
  qrCodeValue: string;

  constructor(public viewCont: ViewController,
              public navParams: NavParams,
              public menuController: MenuController) {

    this.qrCodeValue = navParams.get('value');
  }

  dismiss() {
    this.viewCont.dismiss()
  }
}
