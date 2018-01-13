import { Login } from './login';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    Login,
  ],
  imports: [
    IonicPageModule.forChild(Login)
  ],
  exports: [
    Login
  ]
})
export class LoginModule {}
