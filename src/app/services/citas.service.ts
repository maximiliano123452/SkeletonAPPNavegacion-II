import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  medicoNombre: string;
  especialidad: string;
  fecha: string; // formato ISO
  hora: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private storageKey = 'citas';

  constructor(private storage: StorageService) { }

  async getCitasPorPaciente(pacienteId: string): Promise<Cita[]> {
    const citas: Cita[] = await this.storage.getObject(this.storageKey) || [];
    return citas.filter(c => c.pacienteId === pacienteId);
  }

  async agendarCita(cita: Cita): Promise<void> {
    const citas: Cita[] = await this.storage.getObject(this.storageKey) || [];
    cita.id = this.generateId();
    citas.push(cita);
    await this.storage.setObject(this.storageKey, citas);
  }

  async cancelarCita(citaId: string): Promise<void> {
    let citas: Cita[] = await this.storage.getObject(this.storageKey) || [];
    citas = citas.filter(c => c.id !== citaId);
    await this.storage.setObject(this.storageKey, citas);
  }

  private generateId(): string {
    return 'cita_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
