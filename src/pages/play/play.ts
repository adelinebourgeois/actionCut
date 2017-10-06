import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import {HomePage} from "../home/home";


@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})
export class PlayPage {

  constructor(public navCtrl: NavController) {
  }

  private showHome(){
    this.navCtrl.push(HomePage);
  }

}
