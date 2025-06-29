import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarMedicosPageRoutingModule } from './buscar-medicos-routing.module';

import { BuscarMedicosPage } from './buscar-medicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarMedicosPageRoutingModule
  ],
  declarations: [BuscarMedicosPage]
})
export class BuscarMedicosPageModule {}
