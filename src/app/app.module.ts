import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Media } from '@ionic-native/media';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { GameOnePage } from '../pages/game-one/game-one';
import { InfoPage } from '../pages/info/info';

// Storage
import {SQLite} from "@ionic-native/sqlite";
import {NativeStorage} from "@ionic-native/native-storage";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    GameOnePage,
    InfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    GameOnePage,
    InfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    SQLite,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
