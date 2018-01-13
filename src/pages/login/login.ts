import { FirebaseDBService } from './../../services/firebase.db.service';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';


@IonicPage({
  priority: 'off',
  defaultHistory: ['Home'],
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login{
  private errorMsg: string = "";
  private mode: string = 'signup';
  private signInMail = "";
  private signInPassword = "";
  private signUpName = "";
  private signUpMail = "";
  private signUpPassword = "";


  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService,
    private firebaseDBService: FirebaseDBService, private plt: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');

  }

  signIn() {
    console.log('sign in');
    if (this.signInMail == "" || this.signInPassword == "") {
      this.errorMsg = "Please enter valid email and password"
    } else {
      this.authService.signInWithEmail(this.signInMail, this.signInPassword)
        .then((msg) => {
          console.log(msg);
          this.errorMsg = "";
          this.goTo('Pro');
        })
        .catch((e: any) => {
          this.errorMsg = e.message;
          console.log(e);
        });

    }
  }

  resetPassword() {
    this.authService.resetPassword(this.signInMail)
      .then((msg) => {
        console.log(msg);
        this.errorMsg = "";
        //this.alertService.toastAlert(C.alertSignUpSuccess);
      })
      .catch((e: any) => {
        this.errorMsg = e.message;
        console.log(e);
      });

  }

  signUp() {
    console.log('sign up');
    if (this.signUpMail == "" || this.signUpPassword == "") {
      this.errorMsg = "Please enter valid email and password"
    } else {
    this.authService.signUp(this.signUpMail, this.signUpPassword, this.signUpName)
      .then((msg) => {
        console.log(msg);
        this.errorMsg = "";
        //this.alertService.toastAlert(C.alertSignUpSuccess);
        this.goTo('Pro');
      })
      .catch((e: any) => {
        this.errorMsg = e.message;
        console.log(e);
      });
    }
  }


  goTo(path: string) {
    this.navCtrl.setRoot(path);
  }


}
