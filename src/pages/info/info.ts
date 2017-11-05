import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { NativeStorage } from "@ionic-native/native-storage";

import {GameOnePage} from '../game-one/game-one';

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  private db: SQLiteObject;

  levels: number;
  info: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private nativeStorage: NativeStorage) {
      this.createDbFile();
      this.getData();
      this.levels = navParams.get('level');

  }

  private createDbFile(): void {
      this.sqlite.create({
          name: DATABASE_FILE_NAME,
          location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.db = db;
          this.displayInfo();
      })
      .catch(e => console.log(e));
  }

  // display info on game page
  public displayInfo() {
      this.db.executeSql('SELECT info FROM `Niveaux` WHERE IdNiveaux ='+ this.levels, {})
          .then((data) => {
            if(data == null) {
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  this.info = data.rows.item(i).info;
                }
              }
            }
          })
          .catch( e => console.log(e));
  }

  public nextButton() {
      console.log(this.levels++);
      this.navCtrl.push( GameOnePage, {
          level: this.levels++,
      });
  }

  public getData() {
      this.nativeStorage.getItem('levelsDone')
         .then(
             data => console.log(data),
             error => console.error(error)
         );
}

}
