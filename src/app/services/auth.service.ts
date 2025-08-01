import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import {
  UsuarioBase,
  Medico,
  Paciente,
  Administrador,
  TipoUsuario,
  LoginRequest,
  RegistroRequest,
  EstadoVerificacion
} from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<UsuarioBase | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {
    this.checkAuthState();
  }

  private async checkAuthState() {
    try {
      const userData = await this.storageService.getObject('currentUser');
      if (userData) {
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  async register(datos: RegistroRequest): Promise<UsuarioBase> {
    try {
      const existingUser = await this.storageService.getObject(`user_${datos.email}`);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      const usuarioBase: UsuarioBase = {
        id: this.generateId(),
        email: datos.email,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        fechaNacimiento: new Date(),
        tipoUsuario: datos.tipoUsuario,
        activo: true,
        fechaRegistro: new Date()
      };

      await this.storageService.setObject(`user_${datos.email}`, usuarioBase);
      await this.storageService.set(`password_${datos.email}`, datos.password);

      this.currentUserSubject.next(usuarioBase);
      this.isAuthenticatedSubject.next(true);
      await this.storageService.setObject('currentUser', usuarioBase);

      return usuarioBase;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<UsuarioBase> {
    try {
      const user = await this.storageService.getObject(`user_${credentials.email}`);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const storedPassword = await this.storageService.get(`password_${credentials.email}`);
      if (storedPassword !== credentials.password) {
        throw new Error('Contraseña incorrecta');
      }

      user.ultimoAcceso = new Date();
      await this.storageService.setObject(`user_${credentials.email}`, user);

      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      await this.storageService.setObject('currentUser', user);

      return user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.storageService.remove('currentUser');
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  getCurrentUser(): UsuarioBase | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // ✅ PERFIL MÉDICO
  async actualizarPerfilMedico(medico: Medico): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.MEDICO) {
        throw new Error('Usuario no autorizado');
      }

      // Asegurar que el médico tenga un id
      medico.id = medico.id || currentUser.id;

      await this.storageService.setObject(`user_${medico.email}`, medico);
      await this.storageService.setObject(`perfil_medico_${medico.email}`, medico);

      this.currentUserSubject.next(medico);
      await this.storageService.setObject('currentUser', medico);
    } catch (error) {
      console.error('Error actualizando perfil médico:', error);
      throw error;
    }
  }

  async getPerfilMedico(): Promise<Medico | null> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.MEDICO) {
        return null;
      }
      return await this.storageService.getObject(`perfil_medico_${currentUser.email}`);
    } catch (error) {
      console.error('Error obteniendo perfil médico:', error);
      return null;
    }
  }

  // ✅ PERFIL PACIENTE
  async actualizarPerfilPaciente(paciente: Paciente): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.PACIENTE) {
        throw new Error('Usuario no autorizado');
      }

      await this.storageService.setObject(`user_${paciente.email}`, paciente);
      await this.storageService.setObject(`perfil_paciente_${paciente.email}`, paciente);

      this.currentUserSubject.next(paciente);
      await this.storageService.setObject('currentUser', paciente);
    } catch (error) {
      console.error('Error actualizando perfil paciente:', error);
      throw error;
    }
  }

  async getPerfilPaciente(): Promise<Paciente | null> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.PACIENTE) {
        return null;
      }
      return await this.storageService.getObject(`perfil_paciente_${currentUser.email}`);
    } catch (error) {
      console.error('Error obteniendo perfil paciente:', error);
      return null;
    }
  }

  // ✅ BÚSQUEDA DE MÉDICOS
  async buscarMedicosPorUbicacion(latitud: number, longitud: number, radio: number = 10): Promise<Medico[]> {
    try {
      const medicos: Medico[] = [];
      const keys = await this.storageService.keys();

      for (const key of keys) {
        if (key.startsWith('perfil_medico_')) {
          const medico = await this.storageService.getObject(key);

          if (medico && medico.verificado === EstadoVerificacion.VERIFICADO && medico.coordenadas) {

            if (!medico.id) {
              medico.id = 'user_' + medico.email;
            }

            const distancia = this.calcularDistancia(
              latitud, longitud,
              medico.coordenadas.latitude, medico.coordenadas.longitude
            );

            if (distancia <= radio) {
              medico.distancia = distancia;
              medicos.push(medico);
            }
          }
        }
      }

      return medicos.sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
    } catch (error) {
      console.error('Error buscando médicos:', error);
      return [];
    }
  }

  // ✅ ADMINISTRACIÓN DE MÉDICOS
  async getMedicosPendientesVerificacion(): Promise<Medico[]> {
    try {
      const medicos: Medico[] = [];
      const keys = await this.storageService.keys();

      for (const key of keys) {
        if (key.startsWith('perfil_medico_')) {
          const medico = await this.storageService.getObject(key);
          if (medico && medico.verificado === EstadoVerificacion.PENDIENTE) {
            medicos.push(medico);
          }
        }
      }

      return medicos;
    } catch (error) {
      console.error('Error obteniendo médicos pendientes:', error);
      return [];
    }
  }

  async verificarMedico(medicoId: string, estado: EstadoVerificacion): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.ADMINISTRADOR) {
        throw new Error('No autorizado');
      }

      const keys = await this.storageService.keys();
      for (const key of keys) {
        if (key.startsWith('perfil_medico_')) {
          const medico = await this.storageService.getObject(key);
          if (medico && medico.id === medicoId) {
            medico.verificado = estado;
            await this.storageService.setObject(key, medico);
            await this.storageService.setObject(`user_${medico.email}`, medico);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error verificando médico:', error);
      throw error;
    }
  }

  // ✅ UTILIDADES
  private generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
