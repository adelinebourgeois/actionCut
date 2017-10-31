import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { GameOnePage } from "../game-one/game-one";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    private db: SQLiteObject;

    levels: string[] = [];

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
            this.deleteContent();
            this.createTables();
            this.insertDb();
            this.retrieveDataGameOne();
        })
        .catch(e => console.log(e));
    }

    private createTables(): void {
        this.db.executeSql('CREATE TABLE IF NOT EXISTS `Niveaux` ( `IdNiveaux` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `status` INTEGER DEFAULT 0, `gameType` INTEGER, `question` TEXT, `info` TEXT )', {})
            .then(() => {
                console.log('Table Niveaux created');
                this.db.executeSql('CREATE TABLE IF NOT EXISTS `Reponses` ( `IdReponses` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `reponse` TEXT, `niveauId` INTEGER, FOREIGN KEY(`niveauId`) REFERENCES `Niveaux`(`IdNiveaux`) )', {})
                    .then(() => console.log('Table Reponse created'))
                    .catch(e => console.log(e));
            })
            .catch( e => console.log(e));
    }

    /* Exemple d'insert

    INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, 'Quel réalisateur aurait pu réaliser James Bond ?', "Steven Spielberg, qui venait de connaître un immense succès avec Les dents de la mer, voulut réaliser un James Bond, ce qui lui fut refusé par les producteurs. Il décida alors de passer à autre chose sur les conseils de Georges Lucas, et c'est ainsi que naquit la série Indiana Jones.")

    */

    private insertDb(): void {
        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, "Quel réalisateur aurait pu réaliser James Bond ?", "Steven Spielberg, qui venait de connaître un immense succès avec Les dents de la mer, voulut réaliser un James Bond, ce qui lui fut refusé par les producteurs. Il décida alors de passer à autre chose sur les conseils de Georges Lucas, et c\'est ainsi que naquit la série Indiana Jones.")', {})
            .then(() => console.log('Insert niveau 1 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, "Test ?", "This is a test.")', {})
            .then(() => console.log('Insert niveau 2 created'))
            .catch(e => console.log(e));


    }

    public retrieveDataGameOne() {

      // 'SELECT * FROM `Niveaux` CROSS JOIN `Reponses` WHERE gameType = 1'
      this.db.executeSql('SELECT question FROM `Niveaux`', {})
          .then((data) => {
            if(data == null) {
              // console.log('data is null');
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  console.log('Mes datas : ' + JSON.stringify(data.rows.item(i)));
                  this.levels.push(data.rows.item(i).question);
                }
              }
            }
          })
          .catch( e => console.log(e))
    }

    public displayInfo(){
      console.log(this.levels);
    }

    private deleteContent(): void {
        this.db.executeSql('DELETE from `Niveaux`', {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e))
    }

    private showGame(theLevel){
      this.navCtrl.push(GameOnePage, {
          level: theLevel,
      });
    }




}
