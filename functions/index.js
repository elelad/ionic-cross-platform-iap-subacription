var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const exec = require('child-process-promise').exec;
const gpk = "xxxxxxxxxxxxx";
const iap = require('in-app-purchase');


const iosConfig = {
    applePassword: "xxxxxxxxxxxxxxx"
}

const androidConfig = {
    googlePublicKeyStrSandbox: gpk,
    googlePublicKeyStrLive: gpk,
    googleAccToken: "xxxxxxxxxxxxxxxxxxx",
    googleRefToken: "xxxxxxxxxxxxxxxxxx",
    googleClientID: "xxxxxxxxxxxxxxxxxxx",
    googleClientSecret: "xxxxxxxxxxxxxxxxx"
}

iap.config(androidConfig);
const cors = require('cors')({ origin: true });


exports.validateReceipt = functions.https.onRequest((req, res) => {
    let uid = req.query.uid;
    let appStoreReceipt = req.query.receipt;
    let transRef = admin.database().ref('users/' + uid + '/userPaidData/transaction');
    let paidRef = admin.database().ref('users/' + uid + '/userPaidData/PaidUser');
    let overridePaidRef = admin.database().ref('users/' + uid + '/userPaidData/overridePaid');
    cors(req, res, () => {
        overridePaidRef.once("value", function (overrideValue) {
            if (overrideValue.val() && overrideValue.val() == true) {
                paidRef.set(true);
                console.log('valid');
                res.status(200).send('valid');
            } else {
                transRef.once("value", function (data) {
                    if (data.val()) {
                        console.log(data.val());
                        let transaction = data.val();
                        let receipt;
                        switch (transaction.type) {
                            case "android-playstore":
                                receipt = {
                                    "data": JSON.stringify(transaction.receipt),
                                    "signature": transaction.signature
                                }
                                iap.config(androidConfig);
                                break;
                            case "ios-appstore":
                                receipt = transaction.appStoreReceipt;// transactionReceipt
                                iap.config(iosConfig);
                                break;
                        }
                        if (!receipt) {
                            paidRef.set(false);
                            console.log('no receipt');
                            res.status(200).send('no receipt');
                        }

                        iap.setup(function (error) {
                            if (error) {
                                // oops
                                console.log(error);
                            }
                            iap.validate(receipt, function (err, valRes) {
                                if (err) {
                                    if (err == "Error: This receipt is valid but the subscription has expired. When this status code is returned to your server, the receipt data is also decoded and returned as part of the response.") {
                                        paidRef.set(false);
                                        console.log('apple expired');
                                        res.status(200).send('expired');
                                        return;
                                    }
                                    res.status(500).send(JSON.stringify(err));
                                    return console.error(err);
                                }
                                if (iap.isValidated(valRes)) {
                                    let options = {
                                        ignoreExpired: true
                                    }
                                    var purchaseDataList = iap.getPurchaseData(valRes, options);
                                    console.log(purchaseDataList);
                                    if (purchaseDataList.length == 0) {//all items expired
                                        paidRef.set(false);
                                        console.log('expired, not valid items');
                                        res.status(200).send('expired');
                                    } else {
                                        paidRef.set(true);
                                        console.log('valid');
                                        res.status(200).send('valid');
                                    }
                                } else {
                                    paidRef.set(false);
                                    console.log('invalid');
                                    res.status(200).send('invalid');
                                }

                            });
                        })
                    } else {
                        paidRef.set(false);
                        console.log('expired');
                        res.status(200).send('expired');
                    }
                });
            }
        });
    });
});