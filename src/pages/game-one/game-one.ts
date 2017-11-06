import { Component, Renderer2 } from '@angular/core';
import { NavController, ModalController, NavParams} from 'ionic-angular';
import { AnswerModalPage } from "../answer-modal/answer-modal";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { LifeService } from '../shared/life';
import { NativeStorage } from "@ionic-native/native-storage";


import { MapPage } from "../map/map";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-game-one',
  templateUrl: 'game-one.html',
})
export class GameOnePage {

  private db: SQLiteObject;


  levels: number;
  question: string = '';
  reponses:  Array<{reponse: string, status: number}> = [];
  life: number = 3;
  test: string = '';
  levelDone: boolean;

  constructor(private lifeService: LifeService, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite, private renderer: Renderer2, private nativeStorage: NativeStorage) {

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
        life: this.life,
        levelDone : this.levelDone
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

      this.db.executeSql('SELECT reponse, state FROM `Reponses` CROSS JOIN `Niveaux` ON Reponses.niveauId=Niveaux.IdNiveaux WHERE Niveaux.IdNiveaux ='+this.levels, {})

          .then((data) => {
            console.log(JSON.stringify(data));
            if(data == null) {
                console.log('null');
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  this.reponses.push({reponse: data.rows.item(i).reponse, status: data.rows.item(i).state});

                }
              }
            }
          })
          .catch( e => console.log(e));
  }

  public updateStatus () {
      let levelUp = this.levels;
      console.log(levelUp + ' : niveau actuel');
      this.db.executeSql('UPDATE Niveaux SET status = 1 WHERE IdNiveaux ='+ levelUp++, {})
          .then(() => console.log('UPDATE : ' + levelUp++))
          .catch(e => console.log(e))
  }

  public getTheAnswer(state, event: any) {
      let target = event.target;
      if(target.getAttribute("data-state") == 1) {
        this.renderer.addClass(target, 'green');
      } else {}
      let theAnswer = {answer: state, idQuestion: this.levels};
      let myAnswer = this.modalCtrl.create(AnswerModalPage, theAnswer);
      myAnswer.onDidDismiss(data => {
        this.test = JSON.stringify(data.life);
        this.life = parseFloat(this.test);
      });

        myAnswer.present();
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
