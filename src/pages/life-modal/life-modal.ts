import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { NativeStorage } from "@ionic-native/native-storage";
import { SocialSharing } from '@ionic-native/social-sharing';

import { MapPage } from "../map/map";
import { LifeService } from '../shared/life';

@Component({
  selector: 'page-life-modal',
  templateUrl: 'life-modal.html',
})

export class LifeModalPage {
    life: number;

    constructor(private lifeService: LifeService, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private socialSharing: SocialSharing) {

    }

    public dismiss() {
        this.lifeService.increment();
        this.life = this.lifeService.get();
        let data = {life: this.life};
        this.viewCtrl.dismiss(data);
    }

    public facebookShare() {
        this.socialSharing.canShareVia('Facebook').then(() => {
        }).catch(() => {});

        this.socialSharing.shareViaFacebook('Peux-tu m\'aider à récupérer des vies?', null, 'https://www.google.com').then(() => {
            this.dismiss();
        }).catch(() => {
            console.log('Error!');
        })


    }


}
