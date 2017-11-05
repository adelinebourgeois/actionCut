import { Component, Renderer2  } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { NativeStorage } from "@ionic-native/native-storage";

import { InfoPage } from "../info/info";
import { MapPage } from "../map/map";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-game-one',
  templateUrl: 'game-one.html',
})
export class GameOnePage {

  private db: SQLiteObject;

  levels: number;
  question: string;
  reponses: object[] = [];
  states: string[] = [];
  target: any;
  levelDone: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite,  private renderer: Renderer2, private nativeStorage: NativeStorage) {
      this.createDbFile();
      this.levels = navParams.get('level');
  }

  private createDbFile(): void {
      this.sqlite.create({
          name: DATABASE_FILE_NAME,
          location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.db = db;
          this.displayQuestion();
          this.displayResponses();
      })
      .catch(e => console.log(e));
  }

  public backButton(){
    this.navCtrl.push(MapPage, {
        levelDone : this.levelDone,
    });
  }

  // display question on game page
  public displayQuestion() {
      this.db.executeSql('SELECT question FROM `Niveaux` WHERE IdNiveaux ='+this.levels, {})
          .then((data) => {
            if(data == null) {
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  this.question = data.rows.item(i).question;
                }
              }
            }
          })
          .catch( e => console.log(e));
  }

  // display the response of the question
  public displayResponses() {
      this.db.executeSql('SELECT reponse, state FROM `Reponses` CROSS JOIN `Niveaux` ON Reponses.niveauId = Niveaux.IdNiveaux WHERE Niveaux.IdNiveaux ='+this.levels, {})
          .then((data) => {
            if(data == null) {
                console.log('null');
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  this.reponses.push({'reponse': data.rows.item(i).reponse, 'state': data.rows.item(i).state});
                }
              }
            }
          })
          .catch( e => console.log(e));
  }

  public answer(event: any) {
    this.target = event.target;
    if(this.target.getAttribute('data-state') == 1) {
        this.renderer.addClass(this.target, 'green');
        this.storeData();
        this.navCtrl.push( InfoPage, {
            level: this.levels,
        });
    } else {
        console.log('false: what happen?! A finir');
    }
  }

  public storeData(): void {
      this.nativeStorage.setItem('levelsDone', {
          levels: this.levels,
      })
       .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
       );
  }
}
