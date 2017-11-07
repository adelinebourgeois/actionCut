import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

//Ionic Native
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { NativeStorage } from '@ionic-native/native-storage';

//Pages
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
    life: number;
    isLife: number;
    test: number;

    public checkLife: boolean = false;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite, private lifeService: LifeService,  private nativeStorage: NativeStorage) {
        this.getData();
        this.createDbFile();
    }

    //Creation BDD
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

    // Affiche la question
    public showGame(levelId, status){
        if(this.life != 0) {
            if(status != 0) {
                this.navCtrl.push(GameOnePage, {
                    level: levelId
                });
            }
        } else {
            let myLife = this.modalCtrl.create(LifeModalPage);
            myLife.onDidDismiss(data => {
                this.life = 1;
            });
            myLife.present();
        }
    }

    //Stock la vie
    public storeData(): void{
        this.nativeStorage.setItem('life', {isLife: this.life})
            .then(
                () => console.log('Stored item via la map ! '),
                error => console.error('Error storing item', error)
            );

    }

    //Recupère la vie et check
    public getData() {
        this.nativeStorage.getItem('life')
            .then(
                data => {
                    if (data.isLife != undefined){
                        this.life = data.isLife;
                        this.storeData();
                    } else {
                        this.life = this.lifeService.get();
                        this.storeData();
                    }
                },
                error => {
                    this.life = this.lifeService.get();
                    this.storeData();
                }
            );
    }

}
