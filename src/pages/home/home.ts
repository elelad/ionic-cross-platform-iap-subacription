//import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { NavController, IonicPage, Platform, MenuController } from 'ionic-angular';
//import { IapService } from './../../services/iap.services';
//import { FirebaseDBService } from './../../services/firebase.db.service';



@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home');
    
    
      
  }

  goToLogin() {
    this.navCtrl.setRoot('Login');
  }

  goTo(path: string) {
    this.navCtrl.setRoot(path);
  }

  pushTo(page: string){
    this.navCtrl.push(page);
  }

  


}
