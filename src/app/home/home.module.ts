import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { ExperienciaLaboralComponent } from '../components/experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from '../components/certificaciones/certificaciones.component';
import { MisDatosComponent } from '../components/mis-datos/mis-datos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    ExperienciaLaboralComponent,
    CertificacionesComponent,
    MisDatosComponent
  ]
})
export class HomePageModule {}
