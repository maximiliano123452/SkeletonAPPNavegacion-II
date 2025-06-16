import { Component } from '@angular/core';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: false
})
export class CertificacionesComponent {
  certificacion = {
    nombre: '',
    institucion: '',
    anio: ''
  };

  certificaciones: any[] = [];

  guardar() {
    if (this.certificacion.nombre && this.certificacion.institucion && this.certificacion.anio) {
      this.certificaciones.push({ ...this.certificacion });
      this.certificacion = { nombre: '', institucion: '', anio: '' };
    }
  }
}

