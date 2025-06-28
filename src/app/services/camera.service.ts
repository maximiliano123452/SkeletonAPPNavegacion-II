import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  /**
   * Toma una foto usando la cámara del dispositivo
   */
  async tomarFoto(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 500,
        height: 500
      });

      return image.dataUrl || '';
    } catch (error) {
      console.error('Error tomando foto:', error);
      throw new Error('No se pudo tomar la foto');
    }
  }

  /**
   * Selecciona una imagen de la galería
   */
  async seleccionarDeGaleria(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 500,
        height: 500
      });

      return image.dataUrl || '';
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      throw new Error('No se pudo seleccionar la imagen');
    }
  }

  /**
   * Muestra opciones para tomar foto o seleccionar de galería
   */
  async elegirImagen(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Permite elegir entre cámara y galería
        width: 500,
        height: 500
      });

      return image.dataUrl || '';
    } catch (error) {
      console.error('Error eligiendo imagen:', error);
      throw new Error('No se pudo obtener la imagen');
    }
  }
}