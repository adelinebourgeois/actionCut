import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import {NativeStorage} from "@ionic-native/native-storage";

import { GameOnePage } from "../game-one/game-one";
import { LifeService } from '../shared/life';

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
  selector: 'page-map',
  providers: [LifeService],
  templateUrl: 'map.html',
  // animations: [
  //   trigger('levelState', [
  //     state('inactive', style({
  //       transform: 'scale(1)'
  //     })),
  //     state('active',   style({
  //       transform: 'scale(1.1)'
  //     })),
  //     transition('inactive => active', animate('100ms ease-in')),
  //     transition('active => inactive', animate('100ms ease-out'))
  //   ])
  // ]

})

export class MapPage {

    private db: SQLiteObject;

    levelsId: Array<{levelId: string, status: number}> = [];
    life: number = 3;
    isLife: number;
    state: string = 'inactive';
    checkedValue: boolean = true;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite, private lifeService: LifeService, private nativeStorage: NativeStorage) {
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
      if(status != 0){
        this.navCtrl.push(GameOnePage, {
            level: levelId
        });
      }
    }



}
