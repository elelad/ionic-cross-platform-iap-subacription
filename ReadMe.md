## **Ionic Cross Platform In App Purchase Subscription With Firebase**
Example of ionic cross platform app (ios, android and web) that 
let the user buy an auto renew subscription service and enjoy the service on all of his devices.

### **The Problem:**
We want to sell an auto subscription of a service in our app but let the user the ability to get the service at another devices and platform without having to purchase it again and with the ability to track unsubscribe.

### **The Solution:**
- User sign in useing firebase auth. 
- User purchase a subscription (using [cordova-plugin-purchase](https://github.com/j3k0/cordova-plugin-purchase)). 
- We store the receipt at firebase database. 
- We validate the receipt with firebase functions (using [in-app-purchase](https://github.com/voltrue2/in-app-purchase)) on any device after the user sign-in, based on the database receipt.

### **Try it:**
If you like to see the app in action <a href="mailto:elelad.dev@gmail.com" target="blank">email me</a> your relevant email address and i will add you to my testers at ituns connect and google play console.

You can also see the [PWA](https://elelad.github.io/ionic-subscription/index.html#/home).


### **Getting Started:**
1. #### Set the project: 
    - Download the project. 
    - At the project folder run: 
        ````
        $ npm install
        ````
2. #### Setup Firebase: 
    - Go to [firebase console](https://console.firebase.google.com) and create a project. 
    - At the side menu click *Authentication* and enable Email/Password provider.
    - At the overview screen click on: Add Firebase to your web app and copy this part:

        ````javascript
        {apiKey: "xxxxxxxxxxxxx",
        authDomain: "xxxxx-xxxxx.firebaseapp.com",
        databaseURL: "https://xxxxx-xxxxx.firebaseio.com",
        projectId: "xxxxxx-xxxxxx",
        storageBucket: "xxxxx-xxxxxx.appspot.com",
        messagingSenderId: "xxxxxxxxxxxxx"};
        ````
    - Replace the var **firebaseConfig** at file [app.module.ts](src/app/app.module.ts) with the config you copied in the previous step.
3. #### Create Apps in Appstore and Google Play:
    - ! **When you create In App Purchase prodoct use the same prodoct id for ios and android**. 
    - [Setup iOS Applications](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#setup-ios-applications)
    -  [Setup Android Applications](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#setup-android-applications)
    - When you done go to file [iap.services.ts](src/services/iap.services.ts) and paste the product Id:
        ````javascript
        private productId = "paste-product-id-here";
        ````
    - go to file [config.xml](config.xml) and paste the app id:
        ````xml
        <widget id="paste-app-id-here" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
        ````
4. #### Setup apple password for firebase validate function:
    - Open the App in ituns connect.
    - Click *Features*.
    - From In-App Purchases, click *App-Specific Shared Secret*.
    - Copy the Shared Secret. 
    - Go to file [index.js](functions/index.js) in folder functions, and paste the Shared Secret: 
        ````javascript
        const iosConfig = { applePassword: "paste-the-shared-secret-here"}
        ````
5. #### Setup google key for firebase validate function:
    - Open the app in google play console. 
    - Select *Development tools* and *Services & APIs*. 
    - Copy the license key for the application. 
    - Go to file [index.js](functions/index.js) in folder functions, and paste the key: 
        ````javascript
        const gpk = "paste-the-key-here"
        ````
    - Run:
        ````
        $ cordova plugin remove cc.fovea.cordova.purchase
        ````
    - Run: 
        ````
        $ cordova plugin add cc.fovea.cordova.purchase --variable BILLING_KEY="paste-the-key-here"
        ````
        with the gpk.
6. #### Setup Google Play Store API
    - Go to file [index.js](functions/index.js) in folder functions
    - Follow this [steps](https://github.com/voltrue2/in-app-purchase#google-play-store-api-1) to set the :
        ````javascript
        const androidConfig = {
            googlePublicKeyStrSandbox: gpk,
            googlePublicKeyStrLive: gpk,
            googleAccToken: "paste-googleAccToken-here",
            googleRefToken: "paste-googleRefToken-here",
            googleClientID: "paste-googleClientID-here",
            googleClientSecret: "paste-googleClientSecret-here"
        }
        ````
7. #### Deploy vlaidateRecipits function: 
    - Do this step after you done steps 4,5,6. 
    - go to *functions* folder: 
        ````
        $ cd functions
        ````
    - Run 
        ````
        $ npm install
        ````
    - Go back to the root folder `$ cd ../`
    - Make sure at the root folder
    - Run:
        ````
        $ firbase login
        ````
        And follow the instructions.
    
    - Run: 
        ````
        $ firebase deploy --only functions
        ````
    - When deploy success you will see the url of the function on firebase servers, copy the url. 
    - Go to file [iap.services.ts](src/services/iap.services.ts) in folder src/services and paste the url:
        ````javascript
        private functionUrl = "paste-url-here";
        ````
8. #### Cors setup
    - Use gsutil to setup Cors for firebase project. This step is required for the application to communicate with the server.
    - If you do not have gsutil installed, [install it](https://cloud.google.com/storage/docs/gsutil_install).
    - The the file cors.gcloud.json is in the root folder in this file add to origin array any address you using for your app.
    - Replace the xxxxxxxxx with your firebase app id an run: 
    ````
    gsutil cors set cors.gcloud.json gs://xxxxxxxxx.appspot.com
    ````
9. #### Test
    - [Test Android Applications](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#test-android-applications).
    - [Test iOS Applications](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#test-ios-applications).

