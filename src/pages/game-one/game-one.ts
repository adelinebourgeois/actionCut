import {Component, Renderer2} from '@angular/core';
import { NavController, ModalController, NavParams} from 'ionic-angular';

//Ionic Native
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Vibration } from "@ionic-native/vibration";
import { NativeStorage } from '@ionic-native/native-storage';

//Pages
import { AnswerModalPage } from "../answer-modal/answer-modal";
import { LifeService } from '../shared/life';
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
    life: number;
    isLife: number;

    constructor(private lifeService: LifeService, public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, private sqlite: SQLite, private renderer: Renderer2, private vibration: Vibration, private nativeStorage: NativeStorage) {
        this.createDbFile();
        this.levels = navParams.get('level');
        this.getData();

    }

    //Open BDD file
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

    //Bouton retour Map
    public backButton(){
        this.life = this.lifeService.get();
        this.navCtrl.push(MapPage, {
            life: this.life,
        });
    }

    // display question on game page
    public displayQuestion() {
        this.question = '';
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

    // Display les reponses
    public displayResponses() {
        this.reponses = [];
        this.db.executeSql('SELECT reponse, state FROM `Reponses` CROSS JOIN `Niveaux` ON Reponses.niveauId=Niveaux.IdNiveaux WHERE Niveaux.IdNiveaux ='+this.levels, {})

            .then((data) => {
                if(data == null) {
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

    //Check bonne reponse et lance la modal
    public getTheAnswer(state, event: any) {
        let target = event.target;
        if(target.getAttribute("data-state") == 1) {
            this.renderer.addClass(target, 'green');
        } else {
            this.vibration.vibrate(1000);
        }
        let theAnswer = {answer: state, idQuestion: this.levels};
        let myAnswer = this.modalCtrl.create(AnswerModalPage, theAnswer);
        myAnswer.onDidDismiss(data => {
            this.life = data.life;
        });

        myAnswer.present();
    }

    //Stock la vie
    public storeData(): void{
        this.nativeStorage.setItem('life', {isLife: this.life})
            .then();

    }

    //Recupère la vie et check
    public getData() {
        this.nativeStorage.getItem('life')
            .then(
                data => {
                    if (data.isLife != undefined) {
                        this.life = data.isLife;
                    } else {
                        this.life = this.lifeService.get();
                    }
                    this.storeData();
                },
                error => console.log(error)
            );
    }
}
