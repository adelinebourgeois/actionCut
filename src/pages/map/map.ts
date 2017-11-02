import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { GameOnePage } from "../game-one/game-one";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

    private db: SQLiteObject;

    levelsId: string[] = [];
    response: string[] = [];

    constructor(public navCtrl: NavController, private sqlite: SQLite) {
        this.createDbFile();
    }

    private createDbFile(): void {
        this.sqlite.create({
            name: DATABASE_FILE_NAME,
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            console.log('Create BDD !');
            this.db = db;
            this.displayLevel();
        })
        .catch(e => console.log(e));
    }

    // Affichage des niveaux dans l'écran map
    public displayLevel() {
      this.db.executeSql('SELECT IdNiveaux FROM `Niveaux`', {})
          .then((data) => {
            if(data == null) {
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  console.log('Niveau Id : ' + JSON.stringify(data.rows.item(i)));
                  this.levelsId.push(data.rows.item(i).IdNiveaux);
                }
              }
            }
          })
          .catch( e => console.log(e));

    }

    private showGame(levelId){
      this.navCtrl.push(GameOnePage, {
          level: levelId,
      });
    }
}
