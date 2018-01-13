import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { NavController, IonicPage, Platform, MenuController } from 'ionic-angular';
import { IapService } from './../../services/iap.services';
import { FirebaseDBService } from './../../services/firebase.db.service';



@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-pro',
  templateUrl: 'pro.html'
})
export class Pro {
  private product: any = {
    price: "0.99$",
    transaction : ""
  };
  private paid: boolean;
  private cancelLink:string = "";
  private fromAndroid: boolean = false;
  private fromIOS: boolean = false;

  
  constructor(public navCtrl: NavController, private authService: AuthService, private plt: Platform, 
    private firebaseDBService: FirebaseDBService, private iapService: IapService) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Pro');
    this.paid = this.firebaseDBService.paidUser;
    let p:any = {};
    //get transaction from firebase db and check if the user bought the subscription for googl play or appstore, based on that provide the user a link to cancel subscription
    this.firebaseDBService.getTansactions().then((trans) => {
      if (trans != false) {
        (trans.type == 'android-playstore') ? this.cancelLink = "https://play.google.com/store/account": "";
        (trans.type == 'ios-appstore') ? this.cancelLink = "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/DirectAction/manageSubscriptions": "";
        console.log(this.cancelLink);
      }
    }).catch(e => console.log(e));
    if (!this.plt.is('core') && !this.plt.is('mobileweb')){//if at app mode then get product details form the store
      p = this.iapService.getCloudProduct();
      console.log(`p: ${p}`);
      if (p.price) {
        this.product = p;
      }
    }
      
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
