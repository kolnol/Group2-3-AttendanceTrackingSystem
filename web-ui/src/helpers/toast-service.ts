import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';


@Injectable()
export class ToastService {
    constructor(private toastCtrl: ToastController) {

    }
    
    presentToast(message) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom'
      });
    
      toast.present();
    }
}
