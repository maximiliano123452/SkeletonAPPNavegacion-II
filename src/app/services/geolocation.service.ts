import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

export interface Coordenadas {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  /**
   * Obtiene la posición actual del usuario
   */
  async getCurrentPosition(): Promise<Coordenadas> {
    try {
      // Verificar permisos primero
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          throw new Error('Permisos de ubicación denegados');
        }
      }

      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      });

      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy
      };
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      throw new Error('No se pudo obtener la ubicación actual');
    }
  }

  /**
   * Calcula la distancia entre dos puntos en kilómetros
   */
  calcularDistancia(
    punto1: Coordenadas, 
    punto2: Coordenadas
  ): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.degreesToRadians(punto2.latitude - punto1.latitude);
    const dLon = this.degreesToRadians(punto2.longitude - punto1.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degreesToRadians(punto1.latitude)) * 
      Math.cos(this.degreesToRadians(punto2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Convierte grados a radianes
   */
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}