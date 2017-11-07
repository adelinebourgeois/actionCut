import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { MapPage } from "../map/map";
import { LifeService } from '../shared/life';
import { NativeStorage } from "@ionic-native/native-storage";
import { GameOnePage } from '../game-one/game-one';

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-answer-modal',
  templateUrl: 'answer-modal.html',
})

export class AnswerModalPage {

    private db: SQLiteObject;

    answer: number = 0;
    status: string = '';
    levels: number;
    infos: string[] = [];
    tryAgain: string = '';
    arrow: string = '';
    life: number = 3;

    constructor(private lifeService: LifeService, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private sqlite: SQLite, private nativeStorage: NativeStorage) {
        this.answer = navParams.get('answer');
        this.levels = navParams.get('idQuestion');
        console.log('modal idniveau :' + this.levels);
        this.life = this.lifeService.get();

        if(this.answer === 0) {
          if(this.lifeService.get() != 0){
              this.lifeService.decrement();
          }
          this.status = 'NO, CUT';
          this.tryAgain = 'Réessayer';
          this.arrow = 'Retour';
        } else {
          this.status = 'YES, ACTION';
          this.createDbFile();
          this.arrow = 'Suivant';
        }
    }

    private createDbFile(): void {
        this.sqlite.create({
            name: DATABASE_FILE_NAME,
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.db = db;
            this.displayInfos();
        })
        .catch(e => console.log(e));
    }

    displayInfos(){
      this.db.executeSql('SELECT info FROM `Niveaux` WHERE IdNiveaux ='+this.levels, {})
          .then((data) => {
            if(data == null) {
              return;
            }
            if(data.rows) {
              if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                  this.infos = data.rows.item(i).info;
                }
              }
            }
          })
          .catch( e => console.log(e));
    }

    goToMap() {
      this.life = this.lifeService.get();
      this.navCtrl.push( MapPage, {
        life: this.life
      } );

    }

    public nextButton() {
        this.navCtrl.push( GameOnePage, {
            level: this.levels + 1,
        });
    }

    public getData() {
        this.nativeStorage.getItem('levelsDone')
           .then(
               data => console.log(data),
               error => console.error(error)
           );
    }

    dismiss() {
      this.life = this.lifeService.get();
      let data = {life : this.life};
      this.viewCtrl.dismiss(data);
    }


}
