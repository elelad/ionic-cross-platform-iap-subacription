import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthService } from '../services/auth.service';
import { FirebaseDBService } from '../services/firebase.db.service';
import { IapService } from '../services/iap.services';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import { HttpModule } from '@angular/http';


export const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxxxx.firebaseio.com",
  projectId: "xxxxxxxxx",
  storageBucket: "xxxxxxx.appspot.com",
  messagingSenderId: "xxxxxxxx"
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InAppPurchase2,
    AuthService,
    FirebaseDBService,
    IapService
  ]
})
export class AppModule {}
