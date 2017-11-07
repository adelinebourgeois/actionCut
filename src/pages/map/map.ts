import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from "@ionic-native/sqlite";


import { GameOnePage } from '../game-one/game-one';
import { LifeService } from '../shared/life';
import { LifeModalPage } from '../life-modal/life-modal';

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-map',
  providers: [LifeService],
  templateUrl: 'map.html',
})

export class MapPage {


    private db: SQLiteObject;

    levelsId: Array<{levelId: string, status: number}> = [];
    life: number = 3;
    isLife: number;
    test: string;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite, private lifeService: LifeService) {
        this.createDbFile();
        this.isLife = navParams.get('life');
        if(this.isLife != undefined) {
          this.life = this.isLife;
        } else {
          this.life = this.lifeService.get();
        }

    }

    private createDbFile(): void {
        this.sqlite.create({
            name: DATABASE_FILE_NAME,
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.db = db;
            this.displayLevel();
        })
        .catch(e => console.log(e));
    }

    // Affichage des niveaux dans l'écran map
    public displayLevel() {
      this.levelsId = [];
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
        if(this.life != 0) {
            if(status != 0) {
              this.navCtrl.push(GameOnePage, {
                  level: levelId
              });
            }
        } else {
            let myLife = this.modalCtrl.create(LifeModalPage);
            myLife.onDidDismiss(data => {
                this.test = JSON.stringify(data.life);
                this.life = parseFloat(this.test);
            });
            myLife.present();
        }
    }

}
