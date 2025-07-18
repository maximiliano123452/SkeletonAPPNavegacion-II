import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HistorialMedico } from '../models/historial-medico.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {

  private storageKey = 'historialMedico';

  constructor(private storageService: StorageService) {}

  /**
   * Obtener todo el historial médico
   */
  async getHistoriales(): Promise<HistorialMedico[]> {
    const historiales = await this.storageService.getObject(this.storageKey);
    return historiales ? historiales : [];
  }

  /**
   * Agregar un nuevo registro al historial médico
   */
  async agregarHistorial(historial: HistorialMedico): Promise<void> {
    const historiales = await this.getHistoriales();
    historial.id = this.generateId();
    historiales.push(historial);
    await this.storageService.setObject(this.storageKey, historiales);
  }

  /**
   * Eliminar un registro del historial médico por ID
   */
  async eliminarHistorial(id: string): Promise<void> {
    let historiales = await this.getHistoriales();
    historiales = historiales.filter(h => h.id !== id);
    await this.storageService.setObject(this.storageKey, historiales);
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

}

