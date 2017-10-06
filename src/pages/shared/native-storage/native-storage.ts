import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';


@Component({
    selector: 'page-native-storage',
    templateUrl: 'native-storage.html',
})
export class NativeStorage {

    constructor(public navCtrl: NavController, private nativeStorage: NativeStorage) {
    }


}
