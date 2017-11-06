import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LifeService } from '../pages/shared/life';

import { Media } from '@ionic-native/media';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { GameOnePage } from '../pages/game-one/game-one';
import { AnswerModalPage } from '../pages/answer-modal/answer-modal';

// Storage
import {SQLite} from "@ionic-native/sqlite";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    GameOnePage,
    AnswerModalPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    GameOnePage,
    AnswerModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    SQLite,
    LifeService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
