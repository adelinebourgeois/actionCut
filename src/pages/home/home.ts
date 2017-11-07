import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

//Ionic Native
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { NativeStorage } from "@ionic-native/native-storage";

//Pages
import { MapPage } from "../map/map";

const DATABASE_FILE_NAME: string = 'data.db';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    private db: SQLiteObject;
    public isChecked: boolean = false;

    constructor(public navCtrl: NavController, private sqlite: SQLite, private nativeStorage: NativeStorage) {
        this.createDbFile();
    }

    // Creation BDD
    private createDbFile(): void {
        this.sqlite.create({
            name: DATABASE_FILE_NAME,
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                this.db = db;
                this.createTables();
            })
            .catch(e => console.log(e));
    }

    // Creation des tables BDD
    private createTables(): void {
        this.db.executeSql('CREATE TABLE IF NOT EXISTS `Niveaux` ( `IdNiveaux` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `status` INTEGER, `gameType` INTEGER, `question` TEXT NOT NULL, `info` TEXT )', {})
            .then(() => {
                this.db.executeSql('CREATE TABLE IF NOT EXISTS `Reponses` ( `IdReponses` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `reponse` TEXT NOT NULL, `niveauId` INTEGER, `state` INTEGER, FOREIGN KEY(`niveauId`) REFERENCES `Niveaux`(`IdNiveaux`))', {})
                    .then(() => {
                        this.getData();
                    })
                    .catch(e => console.log(e));
            })
            .catch( e => console.log(e));
    }

    // Insertion des données
    private insertDb(): void {
        this.db.executeSql('INSERT INTO `Niveaux` (status, gameType, question, info)VALUES(1, 1, "Quel réalisateur aurait pu réaliser James Bond ?", "Steven Spielberg, qui venait de connaître un immense succès avec Les dents de la mer, voulut réaliser un James Bond, ce qui lui fut refusé par les producteurs. Il décida alors de passer à autre chose sur les conseils de Georges Lucas, et c\'est ainsi que naquit la série Indiana Jones."),(0, 1, "Par qui a été inventé le personnage Wonder Woman ?", "En 1941, le psychologue américain Charles Moulton Marston s’inspira de son épouse Elizabeth Holloway et de la femme avec laquelle ils vivaient, Olive Byrne, pour créer Wonder Woman. Ses deux compagnes et lui-même étaient des féministes revendiqués, et il eut des enfants avec les 2 femmes, qui s\'appréciaient mutuellement."),(0, 1, "Quel est l\'acteur de la saga Die Hard?", "En tournant le film <<Piège de cristal>> , Bruce Willis a perdu une partie de son audition. Alors qu\'il jouait la scène où il fait feu à travers une table sur un terroriste, l\'acteur approcha le pistolet trop près de son oreille gauche au moment de tirer et a perdu les 2 tiers de son audition à cette oreille."),(0, 2, "<< Là où on va, il n\'y a pas besoin ... >>", "Ronald Reagan, acteur et ancien président des États-Unis, était un fan de la trilogie cinématographique Retour vers le futur. Il reprit une réplique prononcée par Doc Brown à la fin du premier volet pour un de ses discours en 1986 : <<Là où on va, il n\'y a pas besoin de routes.>>"),(0, 2, "<< Tu vois, le monde se divise en deux catégories, ceux qui ont ... et ceux qui creusent. Toi tu creuses >>", "Phrase dite par Blondin à Tuco dans le film <<le Bon, la Brute et le Truand.>>"),(0, 1, "Quel film de guerre est basé sur une histoire vrai?", "Le film devait se dérouler sur des sites militaires allemands mais le ministère fédéral des Finances allemand refuse d\'accorder une autorisation de tournage au <<Bendlerblock>>, ainsi qu\'autour du monument à la Résistance en raison des croyances scientologues de Tom Cruise."), (0, 1, "Dans un Nouvel Espoir, quel est le nom de la planète où habite Luke Skywalker?", "Dans la saga Star Wars, la planète Tatooine est directement inspirée de la ville tunisienne de Tataouine et du désert du même nom, où plusieurs scènes ont été tournées, dont celles sur l\'enfance d\'Anakin et l\'adolescence de Luke Skywalker. Aujourd\'hui encore, on peut y visiter des lieux de tournage laissés intacts."), (0, 2, "Patron, y’a un Indigène qui ... devant ma lame !", "La planète Pandora, sur laquelle se déroule le film Avatar, existe bien : il s\'agit plus exactement d\'une des lunes bergères de Saturne, lune qui se situe à l\'extérieur de l\'anneau F, découverte en 1980 grâce à la sonde Voyager 1. Mais peu de chances d\'y voir des bonshommes bleus et une végétation luxuriante : il y fait près de - 200°.")', {})
            .then(() => {

                this.db.executeSql('INSERT INTO `Reponses` (reponse, niveauId, state)VALUES("Steven Spielberg", 1, 1),("George Lucas", 1, 0),("James Cameron", 1, 0),("Ridley Scott", 1, 0),("Un militaire", 2, 0),("Un homme qui vivait avec 2 femmes", 2, 1),("Une féministe", 2, 0),("Un adolescent", 2, 0),("Arnold Schwarzenegger", 3, 0),("Sylvester Stallone", 3, 0),("Bruce Willis", 3, 1),("Harrison Ford", 3, 0),("de voitures", 4, 0),("d\'argent", 4, 0),("de routes", 4, 1),("de vêtements", 4, 0),("la classe", 5, 0),("des dents", 5, 0),("un fouet", 5, 0),("un pistolet chargé", 5, 1),("Walkyrie", 6, 1), ("Inglorious Bastard", 6, 0), ("Iron Sky", 6, 0), ("La Grande Vadrouille", 6, 0), ("Alderaan", 7, 0), ("Dantooine", 7, 0), ("Tatooine", 7, 1), ("Hoth", 7, 0), ("tourne en rond", 8, 0), ("danse le funk", 8, 1), ("fait une prière", 8, 0), ("se met à genoux", 8, 0)', {})
                    .then()
                    .catch(e => console.log(e));

            })
            .catch(e => console.log(e));

    }

    //Affichage de la page Map
    private showMap(){
        this.navCtrl.push( MapPage );
    }

    //Get la variable isCheck
    public getData() {
        this.nativeStorage.getItem('check')
            .then(
                data => {
                    this.isChecked = data.isCheck;
                },
                error => {
                    if(this.isChecked !== true) {
                        this.insertDb();
                        this.storeData();
                    }
                }
            );
    }

    //Stock la variable isCheck
    public storeData(): void{
        this.nativeStorage.setItem('check', {isCheck: true}).then();

    }
}
