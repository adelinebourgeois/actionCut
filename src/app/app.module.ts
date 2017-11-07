import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

//Native Ionic
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LifeService } from '../pages/shared/life';
import { Media } from '@ionic-native/media';
import { Vibration } from '@ionic-native/vibration';
import { SocialSharing } from '@ionic-native/social-sharing';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { GameOnePage } from '../pages/game-one/game-one';
import {LifeModalPage} from "../pages/life-modal/life-modal";
import { AnswerModalPage } from '../pages/answer-modal/answer-modal';


// Storage
import {SQLite} from "@ionic-native/sqlite";
import {NativeStorage} from "@ionic-native/native-storage";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    GameOnePage,
    AnswerModalPage,
    LifeModalPage,
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
    AnswerModalPage,
    LifeModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    SQLite,
    LifeService,
    NativeStorage,
    Vibration,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
