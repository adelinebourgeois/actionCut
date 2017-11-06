import { Component, Input } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { GameOnePage } from "../game-one/game-one";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { LifeService } from '../shared/life';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-map',
  providers: [LifeService],
  templateUrl: 'map.html',
  animations: [
    trigger('levelState', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active',   style({
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]

})

export class MapPage {

    private db: SQLiteObject;

    levelsId: Array<{levelId: string, status: number}> = [];
    response: string[] = [];
    life: number = 3;
    isLife: number;
    state: string = 'inactive';
    levelDone: boolean;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite, private lifeService: LifeService) {
        this.createDbFile();
        this.isLife = navParams.get('life');
        console.log('IsLife : ' + this.isLife);
        if(this.isLife != undefined) {
          this.life = this.isLife;
        } else {
          this.life = this.lifeService.get();
        }
    }

    toggleState() {
      this.state = this.state === 'active' ? 'inactive' : 'active';
    }

    private createDbFile(): void {
        this.sqlite.create({
            name: DATABASE_FILE_NAME,
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.db = db;
            this.deleteContent();
            this.createTables();
            this.insertDb();
            this.displayLevel();
        })
        .catch(e => console.log(e));
    }

    // Creation des tables de la base de donnée
    private createTables(): void {
      console.log('before create table niveaux');
        this.db.executeSql('CREATE TABLE IF NOT EXISTS `Niveaux` ( `IdNiveaux` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `status` INTEGER DEFAULT 0, `gameType` INTEGER, `question` TEXT, `info` TEXT )', {})
            .then(() => {
              console.log('before create table reponse');
                this.db.executeSql('CREATE TABLE IF NOT EXISTS `Reponses` ( `IdReponses` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `reponse` TEXT, `niveauId` INTEGER, `state` INTEGER, FOREIGN KEY(`niveauId`) REFERENCES `Niveaux`(`IdNiveaux`))', {})
                    .then(() => { console.log('before created table reponse'), this.insertDb()})
                    .catch(e => console.log(e));
            })
            .catch( e => console.log(e));
    }


    // Insertion des données dans la base
    private insertDb(): void {
        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, "Quel réalisateur aurait pu réaliser James Bond ?", "Steven Spielberg, qui venait de connaître un immense succès avec Les dents de la mer, voulut réaliser un James Bond, ce qui lui fut refusé par les producteurs. Il décida alors de passer à autre chose sur les conseils de Georges Lucas, et c\'est ainsi que naquit la série Indiana Jones."),(1, 1, "Par qui a été inventé le personnage Wonder Woman ?", "En 1941, le psychologue américain Charles Moulton Marston s’inspira de son épouse Elizabeth Holloway et de la femme avec laquelle ils vivaient, Olive Byrne, pour créer Wonder Woman. Ses deux compagnes et lui-même étaient des féministes revendiqués, et il eut des enfants avec les 2 femmes, qui s\'appréciaient mutuellement."),(1, 1, "Quel est l\'acteur de la saga Die Hard?", "En tournant le film <<Piège de cristal>> , Bruce Willis a perdu une partie de son audition. Alors qu\'il jouait la scène où il fait feu à travers une table sur un terroriste, l\'acteur approcha le pistolet trop près de son oreille gauche au moment de tirer et a perdu les 2 tiers de son audition à cette oreille."),(1, 2, "<< Là où on va, il n\'y a pas besoin ... >>", "Ronald Reagan, acteur et ancien président des États-Unis, était un fan de la trilogie cinématographique Retour vers le futur. Il reprit une réplique prononcée par Doc Brown à la fin du premier volet pour un de ses discours en 1986 : <<Là où on va, il n\'y a pas besoin de routes.>>"),(1, 2, "<< Tu vois, le monde se divise en deux catégories, ceux qui ont ... et ceux qui creusent. Toi tu creuses >>", "Phrase dite par Blondin à Tuco dans le film <<le Bon, la Brute et le Truand.>>")', {})
            .then(() => console.log('Insert all niveaux'))
            .catch(e => console.log(e));

        this.db.executeSql('INSERT INTO `Reponses` (reponse, niveauId, state)VALUES("Steven Spielberg", 1, 1),("George Lucas", 1, 0),("James Cameron", 1, 0),("Ridley Scott", 1, 0),("Un militaire", 2, 0),("Un homme qui vivait avec 2 femmes", 2, 1),("Une féministe", 2, 0),("Un adolescent", 2, 0),("Arnold Schwarzenegger", 3, 0),("Sylvester Stallone", 3, 0),("Bruce Willis", 3, 1),("Harrison Ford", 3, 0),("de voitures", 4, 0),("d\'argent", 4, 0),("de routes", 4, 1),("de vêtements", 4, 0),("la classe", 5, 0),("des dents", 5, 0),("un fouet", 5, 0),("un pistolet chargé", 5, 1)', {})
            .then(() => console.log('Insert all reponses'))
            .catch(e => console.log(e));
    }

    // Delete table content and reset auto increment ids
    private deleteContent(): void {
        this.db.executeSql('DELETE from `Niveaux`', {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
        this.db.executeSql("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='Niveaux' ", {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
        this.db.executeSql('DELETE from `Reponses`', {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
        this.db.executeSql("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='Reponses'", {})
            .then(() => console.log('Delete content'))
            .catch(e => console.log(e));
    }

    // Affichage des niveaux dans l'écran map
    public displayLevel() {
      this.db.executeSql('SELECT IdNiveaux, status FROM `Niveaux`', {})
          .then((data) => {
            if(data == null) {
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {

                  this.levelsId.push({levelId: data.rows.item(i).IdNiveaux, status: data.rows.item(i).status });


                }
              }
            }
          })
          .catch( e => console.log(e));

    }

    private showGame(levelId, status){
      if(status != 0){
        this.navCtrl.push(GameOnePage, {
            level: levelId
        });
      }

    }

}
