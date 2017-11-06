import { Component } from '@angular/core';
import { NavController, ModalController, NavParams} from 'ionic-angular';
import { AnswerModalPage } from "../answer-modal/answer-modal";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { LifeService } from '../shared/life';
import { MapPage } from "../map/map";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-game-one',
  templateUrl: 'game-one.html',
})
export class GameOnePage {

  private db: SQLiteObject;

  levels: string[] = [];
  question: string = '';
  reponses:  Array<{reponse: string, status: number}> = [];
  states: string[] = [];
  life: number = 3;
  test: string = '';

  // , public modalCtrl: ModalController
  constructor(private lifeService: LifeService, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite) {
      this.createDbFile();
      this.levels = navParams.get('level');
      this.life = this.lifeService.get();

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
    this.life = this.lifeService.get();
    this.navCtrl.push(MapPage, {
        life: this.life
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
                  console.log('Question : ' + JSON.stringify(data.rows.item(i)));
                  this.question = data.rows.item(i).question;
                }
              }
            }
          })
          .catch( e => console.log(e));
  }

  // display the response of the question
  public displayResponses() {
      this.db.executeSql('SELECT reponse, etat FROM `Reponses` LEFT JOIN `Niveaux` ON Reponses.niveauId = Niveaux.IdNiveaux WHERE Niveaux.IdNiveaux ='+this.levels, {})
          .then((data) => {
            console.log(JSON.stringify(data));
            if(data == null) {
                console.log('null');
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  console.log('Reponses : ' + JSON.stringify(data.rows.item(i)));
                  this.reponses.push({reponse: data.rows.item(i).reponse, status: data.rows.item(i).etat});
                }
              }
            }
          })
          .catch( e => console.log(e));
  }

  public getTheAnswer(state) {
    let theAnswer = {answer: state, idQuestion: this.levels};
    let myAnswer = this.modalCtrl.create(AnswerModalPage, theAnswer);
    myAnswer.onDidDismiss(data => {
      this.test = JSON.stringify(data.life);
      console.log('DATA : ' + this.test);
      this.life = parseFloat(this.test);
    });
    myAnswer.present();
  }
}
