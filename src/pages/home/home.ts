import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

// import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
// import { Media, MediaObject } from '@ionic-native/media';

import { MapPage } from "../map/map";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

    // private db: SQLiteObject;
    // private file: MediaObject;

    // , private media: Media
    constructor(public navCtrl: NavController) {
        // this.file = this.media.create('./assets/sounds/intro.mp3');
        // this.file.play();
    }

    private showMap(){
        console.log('go page map');
        this.navCtrl.push( MapPage );
        // this.file.stop();
        // this.file.release();
    }

}
