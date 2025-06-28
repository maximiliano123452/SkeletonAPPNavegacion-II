import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienestarPageRoutingModule } from './bienestar-routing.module';

import { BienestarPage } from './bienestar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BienestarPageRoutingModule
  ],
  declarations: [BienestarPage]
})
export class BienestarPageModule {}
