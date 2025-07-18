import { Component, OnInit } from '@angular/core';
import { HistorialMedicoService } from '../../../services/historial-medico.service';
import { HistorialMedico } from '../../../models/historial-medico.model';

@Component({
  selector: 'app-historial-medico',
  templateUrl: './historial-medico.page.html',
  styleUrls: ['./historial-medico.page.scss'],
  standalone: false,
})
export class HistorialMedicoPage implements OnInit {

  historiales: HistorialMedico[] = [];

  nuevaFecha: string = '';
  nuevoDiagnostico: string = '';
  nuevoTratamiento: string = '';
  nuevosMedicamentos: string = '';

  constructor(private historialService: HistorialMedicoService) {}

  ngOnInit() {
    this.cargarHistoriales();
  }

  async cargarHistoriales() {
    this.historiales = await this.historialService.getHistoriales();
  }

  async agregarHistorial() {
    if (!this.nuevaFecha || !this.nuevoDiagnostico || !this.nuevoTratamiento) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    const nuevoHistorial: HistorialMedico = {
      fecha: this.nuevaFecha,
      diagnostico: this.nuevoDiagnostico,
      tratamiento: this.nuevoTratamiento,
      medicamentos: this.nuevosMedicamentos.split(',').map(m => m.trim())
    };

    await this.historialService.agregarHistorial(nuevoHistorial);

    this.nuevaFecha = '';
    this.nuevoDiagnostico = '';
    this.nuevoTratamiento = '';
    this.nuevosMedicamentos = '';

    await this.cargarHistoriales();
  }

  async eliminarHistorial(id: string) {
    await this.historialService.eliminarHistorial(id);
    await this.cargarHistoriales();
  }

}


