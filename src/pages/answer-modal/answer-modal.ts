import {Component} from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

//Ionic Native
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { NativeStorage } from "@ionic-native/native-storage";

//Pages
import { LifeService } from '../shared/life';
import { GameOnePage } from '../game-one/game-one';
import { MapPage } from "../map/map";

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
    life: number;
    isLife: number;

    constructor(private lifeService: LifeService, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private sqlite: SQLite, private nativeStorage: NativeStorage) {
        this.answer = navParams.get('answer');
        this.levels = navParams.get('idQuestion');

        //Si reponse fausse -> Decremente vie et stock -> Affichage modal
        if(this.answer === 0) {
            this.nativeStorage.getItem('life').then( data => {
                if(data.isLife != 0) {
                    this.isLife = data.isLife;
                    this.life = this.isLife-1;
                    this.storeData();
                }
            });
            this.status = 'NO, CUT';
            this.tryAgain = 'Réessayer';
            this.arrow = 'Retour';
        } else {
            this.status = 'YES, ACTION';
            this.createDbFile();
            this.arrow = 'Suivant';
        }
        if(this.life === 0) {
            this.navCtrl.push(MapPage);
        }
    }

    //Open BDD file
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

    //Display infos
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

    //Update status Niveau
    public updateStatus (levelUp) {
        this.db.executeSql('UPDATE Niveaux SET status = 1 WHERE IdNiveaux ='+ levelUp, {})
            .then()
            .catch(e => console.log(e))
    }

    //Affichage Map avec vie stocké
    goToMap() {
        this.life = this.lifeService.get();
        this.navCtrl.push( MapPage, {
            life: this.life
        } );
    }

    //Niveau suivant
    public nextButton() {
        let updateLevel = this.levels+1;
        this.updateStatus(updateLevel);
        this.navCtrl.push( GameOnePage, {
            level: updateLevel,
        });
    }

    //Enlève modal answer
    dismiss() {
        this.nativeStorage.getItem('life').then( data => {
            this.life = data.isLife;
        });
        let data = {life : this.life};
        this.viewCtrl.dismiss(data);
        if(this.life === 0) {
            this.navCtrl.push(MapPage,
                {
                    life: this.life,
                }
            );
        }
    }

    //Stock la vie
    public storeData(): void{
        this.nativeStorage.setItem('life', {isLife: this.life}).then();
    }
}
