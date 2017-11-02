import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { MapPage } from "../map/map";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

    private db: SQLiteObject;

    constructor(public navCtrl: NavController, private sqlite: SQLite) {
        this.createDbFile();
    }

    // Creation de la base de données
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
        })
        .catch(e => console.log(e));
    }

    // Creation des tables de la base de donnée
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


    // Insertion des données dans la base
    private insertDb(): void {
        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, "Quel réalisateur aurait pu réaliser James Bond ?", "Steven Spielberg, qui venait de connaître un immense succès avec Les dents de la mer, voulut réaliser un James Bond, ce qui lui fut refusé par les producteurs. Il décida alors de passer à autre chose sur les conseils de Georges Lucas, et c\'est ainsi que naquit la série Indiana Jones.")', {})
            .then(() => console.log('Insert niveau 1 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Reponses` (reponse, niveauId)VALUES("reponse 1", 1)', {})
            .then(() => console.log('Insert reponse 1 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Reponses` (reponse, niveauId)VALUES("reponse 2", 1)', {})
            .then(() => console.log('Insert reponse 2 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 2, "Test 1 ?", "This is a test 1.")', {})
            .then(() => console.log('Insert niveau 2 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 3, "Test 2 ?", "This is a test 2.")', {})
            .then(() => console.log('Insert niveau 3 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, "Test 3 ?", "This is a test 3.")', {})
            .then(() => console.log('Insert niveau 4 created'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 2, "Test 4 ?", "This is a test 4.")', {})
            .then(() => console.log('Insert niveau 5 created'))
            .catch(e => console.log(e));
    }

    // Delete table content and reset auto increment ids
    private deleteContent(): void {
        this.db.executeSql('DELETE from `Niveaux`', {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
        this.db.executeSql("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='Niveaux';", {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
        this.db.executeSql('DELETE from `Reponses`', {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
        this.db.executeSql("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='Reponses';", {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
    }

    private showMap(){
        this.navCtrl.push( MapPage );
    }

}
