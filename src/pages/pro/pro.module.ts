import { Pro } from './pro';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    Pro
  ],
  imports: [
    IonicPageModule.forChild(Pro),
    
  ],
  exports: [
    Pro
  ]
})
export class ProPageModule {}
