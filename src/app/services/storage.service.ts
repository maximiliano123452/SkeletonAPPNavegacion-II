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
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Método unificado para set - usa Ionic Storage para datos complejos
   */
  async set(key: string, value: any): Promise<void> {
    try {
      if (typeof value === 'string') {
        await Preferences.set({ key, value });
      } else {
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
      const prefsResult = await Preferences.get({ key });
      if (prefsResult.value !== null) {
        return prefsResult.value;
      }
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
   * Guardar objetos como JSON string
   */
  async setObject(key: string, object: any): Promise<void> {
    await this.set(key, JSON.stringify(object));
  }

  /**
   * Obtener y parsear objetos JSON
   */
  async getObject(key: string): Promise<any> {
    const data = await this.get(key);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return data; // Si no es JSON válido, devuelve como está
    }
  }
}

