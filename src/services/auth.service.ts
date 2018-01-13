import { Observable } from 'rxjs/Observable';
import { IapService } from './iap.services';
import { Platform } from 'ionic-angular';
import { Injectable, ApplicationRef } from "@angular/core";//, NgZone
import { FirebaseDBService } from "./firebase.db.service";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';



@Injectable()
export class AuthService {

    public displayName: string = "";
    public firstName: string = "";
    email: string;
    emailVerified: string;
    public photoURL: string;
    isAnonymous: string;
    public uid: string;
    providerData: string;
    public loggedIn: boolean = false;
    public signUpDone: boolean = true;
    public providerId: string;
    public isPasswordProvider:boolean = false;



    constructor(private afAuth: AngularFireAuth, private ref: ApplicationRef, private plt: Platform, private firebaseDbservice: FirebaseDBService, private iapService: IapService) {
        
    }

    initAuth() {
        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged((editor: any) => {
            if (editor) {//if user sign in
                console.log('User is signed in ' + editor.uid);
                this.loggedIn = true;
                this.email = editor.email;
                this.uid = editor.uid;
                this.iapService.validationEnd = false; //remove loading spin
                //Start listen to a paid var at firebase database, If during server validation it turns out that the subscription has expired, 
                //the server will update this variable on firebaseDB and this function will automatically disable the privileges of a paid subscription
                this.firebaseDbservice.listenToPaidUser().subscribe(paid => {
                    console.log(`paid: ${paid}`); 
                    if (paid) {
                        ///===> Do here what ever you want when user is at PRO version
                    } else {
                        this.iapService.initIap(editor.uid);
                    }
                });
                //Validate the subscription of this user
                this.iapService.validateRe(editor.uid).catch((e: any) => {
                    console.log(e);
                });
                if (editor.displayName) {
                    this.displayName = editor.displayName;
                    this.firstName = this.displayName;
                    if ( this.displayName.indexOf(" ") != -1){
                        this.firstName = this.displayName.slice(0, this.displayName.indexOf(" "));    
                    }
                }
                if (editor.photoURL) {
                    this.photoURL = editor.photoURL;
                }
                editor.providerData.forEach((profile) => {
                    if (profile.providerId == "password") {
                      this.isPasswordProvider = true;
                    }
                  });
                this.signUpDone = true;
                this.ref.tick();
                this.firebaseDbservice.setLastLogin();
            } else {//if user sign out
                this.firebaseDbservice.paidUser = false;//if user sign out then cancel paid privileges
                this.iapService.validationEnd = true;
                console.log('User is signed out');
                this.loggedIn = false;
                this.signUpDone = true;
                this.displayName = "";
                this.firstName = "";
                this.ref.tick();
            }
        });
    }

    //functions for auth not all in use at this project
    signUp(email, password, displayName) {
        this.signUpDone = false;
        return new Promise((res, rej) => {
            this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
                this.displayName = displayName;
                this.firstName = displayName.slice(0, this.displayName.indexOf(" "));
                this.photoURL = "";
                user.updateProfile({
                    displayName: displayName,
                    photoURL: ""
                }).then(() => {
                    res('success');
                }).catch(e => {
                    console.log(e);
                    this.signUpDone = true;
                });
            }).catch((e) => {
                console.log(e);
                this.signUpDone = true;
                rej(e);
            })
        })

    }

    signInWithEmail(email, password) {
        this.signUpDone = false;
        return new Promise((res, rej) => {
            this.afAuth.auth.signInWithEmailAndPassword(email, password)
                .then((user) => {
                    res('success');
                })
                .catch((e) => {
                    console.log(e);
                    this.signUpDone = true;
                    rej(e);
                })
        })

    }

    resetPassword(email) {
        return new Promise((res, rej) => {
            this.afAuth.auth.sendPasswordResetEmail(email)
                .then((user) => {
                    res('success');
                })
                .catch((e) => {
                    console.log(e);
                    rej(e);
                })
        })
    }

    updateDisplayName(name: string) {
        var user = firebase.auth().currentUser;
        this.displayName = name;
        return user.updateProfile({
            displayName: name,
            photoURL: user.photoURL
        });

    }

    updateUserImage(url: string) {
        var user = firebase.auth().currentUser;
        this.photoURL = url;
        return user.updateProfile({
            displayName: user.displayName,
            photoURL: url
        });

    }

    updateEmail(newEmail: string, password: string) {
        var user = firebase.auth().currentUser;
        return this.signInWithEmail(user.email, password).then((success: string) => {
            if (success == 'success') {
                let credential = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    password
                );
                return user.reauthenticateWithCredential(credential).then(() => {
                    // User re-authenticated.
                    this.email = newEmail;
                    return user.updateEmail(newEmail);
                }).catch((error) => {
                    // An error happened.
                    //console.log(error);
                    return Promise.reject(error);
                });
            } else {
                return Promise.reject('error');
            }

        }).catch((e) => {
            return Promise.reject(e);
        })
    }

    updatePassword(password: string, newPassword: string) {
        let user = firebase.auth().currentUser;
        return this.signInWithEmail(user.email, password).then((success: string) => {
            if (success == 'success') {
                let credential = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    password
                );
                return user.reauthenticateWithCredential(credential).then(() => {
                    // User re-authenticated.
                    return user.updatePassword(newPassword);
                }).catch((error) => {
                    // An error happened.
                    //console.log(error);
                    return Promise.reject(error);
                });
            } else {
                return Promise.reject('error');
            }

        }).catch((e) => {
            return Promise.reject(e);
        })
    }

    authErrorToMsg(e: any) {
        let returnOb = {
            msg: e.message,
            problemWith: ""
        }
        switch (e.code) {
            case "auth/invalid-email":
                returnOb.problemWith = "email";
                break;
            case "auth/user-not-found":
                returnOb.problemWith = "email";
                break;
            case "auth/email-already-in-use":
                returnOb.problemWith = "email";
                break;
            case "auth/invalid-email":
                returnOb.problemWith = "email";
                break;
            case "auth/user-disabled":
                returnOb.problemWith = "email";
                break;
            case "auth/user-not-found":
                returnOb.problemWith = "email";
                break;
            case "auth/wrong-password":
                returnOb.problemWith = "password";
                break;
            case "auth/weak-password":
                returnOb.problemWith = "password";
                break;
            default:
                returnOb.msg = "error"
                break;
        }
        return returnOb;
    }

    signInWithGoogle() {
        this.signUpDone = false;
        if (this.plt.is('cordova')) {
            console.log('sing in cordova');
            this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
            this.afAuth.auth.getRedirectResult()
                .then(res => {
                    console.log(res);
                }, (error: any) => {
                    let email = error.email;
                    if (error.code === 'auth/account-exists-with-different-credential') {
                        this.afAuth.auth.fetchProvidersForEmail(email).then(function (providers) {
                            console.log(providers);
                        });
                    }
                    this.signUpDone = true;
                })
                .catch(e => {
                    console.log(e);
                    this.signUpDone = true;
                });
        } else {
            this.afAuth.auth
                .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then(res => {
                    console.log(res);
                    //console.log(firebase.auth().currentUser)
                })
                .catch(e => {
                    console.log(e);
                    this.signUpDone = true;
                });
        }

    }

    signOut() {
        this.afAuth.auth.signOut();
        this.signUpDone = true;
    }

    onAuth() {
        return new Observable(observ => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    observ.next(user);
                } else {
                    observ.next(false);
                }
            })
        })
    }

    
    
}