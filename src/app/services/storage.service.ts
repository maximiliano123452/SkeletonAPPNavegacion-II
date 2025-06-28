import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // Crear instancia de storage
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Método unificado para set - usa Ionic Storage para datos complejos
   */
  async set(key: string, value: any): Promise<void> {
    try {
      if (typeof value === 'string') {
        // Para strings simples, usar Capacitor Preferences
        await Preferences.set({ key, value });
      } else {
        // Para objetos complejos, usar Ionic Storage
        await this._storage?.set(key, value);
      }
    } catch (error) {
      console.error('Error setting data:', error);
      throw error;
    }
  }

  /**
   * Método unificado para get
   */
  async get(key: string): Promise<any> {
    try {
      // Intentar primero con Capacitor Preferences
      const prefsResult = await Preferences.get({ key });
      if (prefsResult.value !== null) {
        return prefsResult.value;
      }

      // Si no existe en Preferences, buscar en Ionic Storage
      return await this._storage?.get(key);
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  /**
   * Método unificado para remove
   */
  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
      await this._storage?.remove(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las keys
   */
  async keys(): Promise<string[]> {
    try {
      const prefsKeys = await Preferences.keys();
      const storageKeys = await this._storage?.keys() || [];
      
      // Combinar y eliminar duplicados
      return [...new Set([...prefsKeys.keys, ...storageKeys])];
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  /**
   * Limpiar todo el storage
   */
  async clear(): Promise<void> {
    try {
      await Preferences.clear();
      await this._storage?.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Método específico para datos JSON
   */
  async setObject(key: string, object: any): Promise<void> {
    await this.set(key, JSON.stringify(object));
  }

  /**
   * Método específico para obtener datos JSON
   */
  async getObject(key: string): Promise<any> {
    const data = await this.get(key);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return data; // Si no es JSON válido, devolver como está
    }
  }
}
