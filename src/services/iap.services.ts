import { Http } from '@angular/http';
import { FirebaseDBService } from './firebase.db.service';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import 'rxjs/add/operator/retry';



@Injectable()
export class IapService {
    private functionUrl = "paste-url-here";
    private productId = "paste-product-id-here";
    public validationEnd: boolean = false;
    private initiated: boolean = false;
    public buyAtProccess: boolean = false;
    public userMsg: string = "";

    constructor(private iap: InAppPurchase2, private plt: Platform, private firebaseDBService: FirebaseDBService, private http: Http) {

    }

    initIap(uid: string) {
        if (!this.initiated) {
            this.plt.ready().then(() => {
                console.log(this.iap);
                //this.iap.verbosity = this.iap.INFO;
                this.iap.error(e => console.log(e));

                this.iap.register({
                    id: this.productId,
                    alias: "cloud",
                    type: this.iap.PAID_SUBSCRIPTION
                });
                this.iap.ready().then(() => {
                    console.log("STORE READY");
                }).catch(e => console.log(e));
                this.iap.when(this.productId, 'approved', this.approved);
                this.iap.when(this.productId, 'owned', this.owned);
                this.iap.when(this.productId, 'verified', this.verified);
                this.iap.when(this.productId, 'unverified', this.unverified);
                this.iap.when(this.productId, 'cancelled', this.cancelled);
                this.iap.when(this.productId, 'error', this.error);
                this.iap.when(this.productId, 'updated', this.updated);
                this.iap.when(this.productId, 'expired', this.expired);
                this.iap.when(this.productId, 'invalid', this.invalid);

                // After we've done our setup, we tell the store to do
                // it's first refresh. Nothing will happen if we do not call store.refresh()
                this.iap.validator = (product:any, callback) => {
                    console.log('validator start');
                    this.firebaseDBService.setTransactions(product.transaction).then(() => {
                        this.validateRe(uid).then(info => {
                            if (info == 'valid') {
                                callback(true, { product: product });
                            } else {
                                let code = 0;
                                (info == 'invalid') ? code = this.iap.INVALID_PAYLOAD : '';
                                (info == 'expired') ? code = this.iap.PURCHASE_EXPIRED : '';
                                callback(false, { code: code });
                            }
                        }).catch(e => {
                            console.log('validation error');
                            console.log(e);
                            callback(false, { code: 0 });
                        });    
                    }).catch(e => console.log(e));
                    
                }
                this.iap.refresh();
                this.initiated = true;
            }).catch(e => console.log(e));
        }

    }

    approved = (p) => {
        console.log('approved');
        this.userMsg = ""//C.storeWaitingForOrederDetails;
        p.verify();
    }

    owned = (p) => {
        console.log('owned');
        this.firebaseDBService.setPaidUser(true);
        this.buyAtProccess = false;
        this.off();
    }

    verified = (p) => {
        console.log('verified');
        this.buyAtProccess = false;
        p.finish();
    }

    unverified = (p) => {
        console.log('unverified');
        this.buyAtProccess = false;
    }

    cancelled = (p) => {
        console.log('cancelled');
        this.buyAtProccess = false;
    }

    updated = (p) => {
        console.log('updated');
    }

    expired = (p) => {
        console.log('expired');
        this.firebaseDBService.setPaidUser(false);
        this.buyAtProccess = false;
    }

    error = (e) => {
        console.log('error ' + e);
        this.buyAtProccess = false;
    }

    invalid = (p) => {
        console.log('invalid');
        this.firebaseDBService.setPaidUser(false);
        this.buyAtProccess = false;
    }

    getCloudProduct() {
        return this.iap.get(this.productId);
    }


    buy() {
        this.buyAtProccess = true;
        this.userMsg = "";// C.storeWaitingToStore;
        this.iap.order(this.productId).then(() => {console.log('buy in progress');});
        /* .catch(e => {
            this.userMsg = "";//C.storeErorr;
            this.buyAtProccess = false;
            console.log(e);
        }); */
    }

    off() {
        this.iap.off(this.approved);
        this.iap.off(this.verified);
        this.iap.off(this.unverified);
        this.iap.off(this.owned);
        this.iap.off(this.cancelled);
        this.iap.off(this.updated);
        this.iap.off(this.expired);
        this.iap.off(this.error);
        this.iap.off(this.invalid);
        this.buyAtProccess = false;
        console.log('off all store callbacks');
    }

    refresh(){
        this.iap.refresh();
    }

    validateRe(uid: string) {
        return new Promise((res, rej) => {
            this.validationEnd = false;
            this.http.get(this.functionUrl + "?uid=" + uid)
                .retry(3)
                .subscribe(
                (respond: any) => {
                    //console.log(respond);
                    let info = respond._body;
                    console.log(`validations result: ${info}`);
                    this.validationEnd = true;
                    res(info);
                },
                (error: any) => {
                    console.log(error);
                    this.validationEnd = true;
                    rej('error');
                }
                );
        });
    }

    validationStart() {
        this.validationEnd = true;
        //this.
    }


}