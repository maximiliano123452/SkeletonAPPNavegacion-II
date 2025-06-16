import { Component } from '@angular/core';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: false
})
export class MisDatosComponent {
  datos = {
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  };

  guardar() {
    console.log('Datos personales guardados:', this.datos);
  }
}

