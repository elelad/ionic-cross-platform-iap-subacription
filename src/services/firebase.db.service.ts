import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
//import { AuthService } from "./auth.service";
//import { AngularFireDatabase } from 'angularfire2/database';//, FirebaseListObservable
//import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
//import { FirebaseApp } from 'angularfire2';


@Injectable()
export class FirebaseDBService {
    //database = firebase.database() || undefined;
    //userId: string;
    public canEdit: boolean = false;
    public paidUser: boolean = false;

    /* setUserId(id: string) {
        //this.userId = id;
    } */

    constructor() {
        
    }

    //----------- IAP -------------------------

    setTransactions(trans: any) {
        if (firebase && firebase.auth().currentUser) {
            let newTrans: any = trans;
            for (let key in trans) {
                if (trans[key] == undefined) {
                    newTrans[key] = "";
                }
            }
            let userTransRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/userPaidData/transaction');
            return userTransRef.set(newTrans);
        }
    }

    isTansactionsExist(): Promise<boolean> {
        return new Promise((res, rej) => {
            if (firebase && firebase.auth().currentUser) {
                let userTransRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/userPaidData/transaction');
                userTransRef.once('value', (data) => {
                    if (data.val()) {
                        res(true);
                    } else {
                        res(false);
                    }
                })
            } else {
                res(false);
            }
        })
    }

    getTansactions(): Promise<any> {
        return new Promise((res, rej) => {
            if (firebase && firebase.auth().currentUser) {
                let userTransRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/userPaidData/transaction');
                userTransRef.once('value', (data) => {
                    //console.log(data.val());
                    if (data.val()) {
                        res(data.val());
                    } else {
                        res(false);
                    }
                })
            } else {
                res(false);
            }
        })
    }

    setLastLogin() {
        if (firebase && firebase.auth().currentUser) {
            let userLastLoginRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/usersPaidData/LastLogin');
            userLastLoginRef.set(performance.timing.navigationStart);
        }
    }

    setPaidUser(paid: boolean) {
        if (firebase && firebase.auth().currentUser) {
            let lastPaidData = false;
            if (paid != lastPaidData){
                console.log('setting paid = ' + paid);
                let userPaidUserRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/userPaidData/PaidUser');
                userPaidUserRef.set(paid);
            }
        }
    }

    listenToPaidUser() {
        return new Observable(observ => {
            if (firebase && firebase.auth().currentUser) {
                let userPaidUserRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/userPaidData/PaidUser');
                userPaidUserRef.on('value', (snapshot) => {
                    let paid = false;
                    if (snapshot.val()) {
                        paid = snapshot.val() == true;
                        console.log(snapshot.val());
                        console.log(`paid: ${paid}`);
                    } else {
                        userPaidUserRef.set(paid);
                    }
                    this.paidUser = paid;
                    observ.next(paid);
                });
            } else {
                observ.next(false);
            }
        });
    }
}
