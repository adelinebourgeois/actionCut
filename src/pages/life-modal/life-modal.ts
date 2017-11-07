import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

//Ionic Native
import { NativeStorage } from "@ionic-native/native-storage";
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
    selector: 'page-life-modal',
    templateUrl: 'life-modal.html',
})

export class LifeModalPage {
    isLife: any;
    life: number;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private socialSharing: SocialSharing, private nativeStorage: NativeStorage) {

    }

    //Enlève la modal life et incremente la vie
    public dismiss() {
        this.nativeStorage.getItem('life').then( data => {
            if(data.isLife === 0) {
                this.isLife = data.isLife;
                this.life = this.isLife+1;
                this.storeData();
            }
        });
        let data = {life: this.life};
        this.viewCtrl.dismiss(data);
    }

    //Partage Facebook
    public facebookShare() {
        this.socialSharing.canShareVia('Facebook').then(() => {
        }).catch();

        this.socialSharing.shareViaFacebook('Peux-tu m\'aider à récupérer des vies?', null, 'https://www.google.com').then(() => {
            this.dismiss();
        }).catch()

    }

    //Stock la vie
    public storeData(): void{
        this.nativeStorage.setItem('life', {isLife: this.life}).then();
    }

}
