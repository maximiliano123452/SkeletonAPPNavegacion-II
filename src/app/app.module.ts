import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Storage de Ionic
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

// Plugins de SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

// Servicios
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { GeolocationService } from './services/geolocation.service';
import { CameraService } from './services/camera.service';
import { WellnessService } from './services/wellness.service';

// Componentes
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent // 👈 NUEVO componente
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    
    // Configuración de almacenamiento
    IonicStorageModule.forRoot({
      name: '__salud_app_db',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    SQLitePorter,
    StorageService,
    AuthService,
    GeolocationService,
    CameraService,
    WellnessService // 👈 NUEVO servicio
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
