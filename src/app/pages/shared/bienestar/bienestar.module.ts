import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienestarPageRoutingModule } from './bienestar-routing.module';

import { BienestarPage } from './bienestar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BienestarPageRoutingModule
  ],
  declarations: [BienestarPage]
})
export class BienestarPageModule {}
