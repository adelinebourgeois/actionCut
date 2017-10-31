import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-game-one',
  templateUrl: 'game-one.html',
})
export class GameOnePage {

  levels: string[] = [];

  private db: SQLiteObject;

  constructor(public navCtrl: NavController, private sqlite: SQLite, public navParams: NavParams) {
      this.levels = navParams.get('level');
      this.retrieveQuestion();
  }

  public retrieveQuestion() {
    console.log('this is the question : ' + this.levels);
  }

}
