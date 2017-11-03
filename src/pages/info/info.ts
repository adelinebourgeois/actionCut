import { Component, Renderer2  } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  private db: SQLiteObject;

  levels: string[] = [];
  info: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite,  private renderer: Renderer2) {
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
          this.displayInfo();
      })
      .catch(e => console.log(e));
  }

  public backButton(){
    this.navCtrl.pop();
  }

  // display info on game page
  public displayInfo() {
      console.log('displayinfo')
      this.db.executeSql('SELECT info FROM `Niveaux` WHERE IdNiveaux ='+this.levels, {})
          .then((data) => {
            if(data == null) {
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  console.log('Info : ' + JSON.stringify(data.rows.item(i)));
                  this.info = data.rows.item(i).info;
                }
              }
            }
          })
          .catch( e => console.log(e));
  }

}
