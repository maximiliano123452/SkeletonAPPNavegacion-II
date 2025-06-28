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

  /**
   * Verifica el estado de autenticación al iniciar la app
   */
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

  /**
   * Registro de usuario
   */
  async register(datos: RegistroRequest): Promise<UsuarioBase> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.storageService.getObject(`user_${datos.email}`);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear usuario base
      const usuarioBase: UsuarioBase = {
        id: this.generateId(),
        email: datos.email,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        fechaNacimiento: new Date(), // Se actualizará en el perfil
        tipoUsuario: datos.tipoUsuario,
        activo: true,
        fechaRegistro: new Date()
      };

      // Guardar usuario
      await this.storageService.setObject(`user_${datos.email}`, usuarioBase);
      await this.storageService.set(`password_${datos.email}`, datos.password);

      // Establecer como usuario actual
      this.currentUserSubject.next(usuarioBase);
      this.isAuthenticatedSubject.next(true);
      await this.storageService.setObject('currentUser', usuarioBase);

      return usuarioBase;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Login de usuario
   */
  async login(credentials: LoginRequest): Promise<UsuarioBase> {
    try {
      // Verificar usuario
      const user = await this.storageService.getObject(`user_${credentials.email}`);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      const storedPassword = await this.storageService.get(`password_${credentials.email}`);
      if (storedPassword !== credentials.password) {
        throw new Error('Contraseña incorrecta');
      }

      // Actualizar último acceso
      user.ultimoAcceso = new Date();
      await this.storageService.setObject(`user_${credentials.email}`, user);

      // Establecer como usuario actual
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      await this.storageService.setObject('currentUser', user);

      return user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
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

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): UsuarioBase | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Actualizar perfil de médico
   */
  async actualizarPerfilMedico(medico: Medico): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.MEDICO) {
        throw new Error('Usuario no autorizado');
      }

      // Actualizar datos del médico
      await this.storageService.setObject(`user_${medico.email}`, medico);
      await this.storageService.setObject(`perfil_medico_${medico.email}`, medico);
      
      // Actualizar usuario actual
      this.currentUserSubject.next(medico);
      await this.storageService.setObject('currentUser', medico);
    } catch (error) {
      console.error('Error actualizando perfil médico:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil de médico
   */
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

  /**
   * Actualizar perfil de paciente
   */
  async actualizarPerfilPaciente(paciente: Paciente): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.PACIENTE) {
        throw new Error('Usuario no autorizado');
      }

      // Actualizar datos del paciente
      await this.storageService.setObject(`user_${paciente.email}`, paciente);
      await this.storageService.setObject(`perfil_paciente_${paciente.email}`, paciente);
      
      // Actualizar usuario actual
      this.currentUserSubject.next(paciente);
      await this.storageService.setObject('currentUser', paciente);
    } catch (error) {
      console.error('Error actualizando perfil paciente:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil de paciente
   */
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

  /**
   * Buscar médicos por ubicación
   */
  async buscarMedicosPorUbicacion(latitud: number, longitud: number, radio: number = 10): Promise<Medico[]> {
    try {
      const medicos: Medico[] = [];
      
      // Simular búsqueda en storage (en producción sería una API)
      const keys = await this.storageService.keys();
      for (const key of keys) {
        if (key.startsWith('perfil_medico_')) {
          const medico = await this.storageService.getObject(key);
          if (medico && medico.verificado === EstadoVerificacion.VERIFICADO && medico.coordenadas) {
            // Calcular distancia
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

  /**
   * Obtener médicos pendientes de verificación (para admins)
   */
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

  /**
   * Verificar médico (para admins)
   */
  async verificarMedico(medicoId: string, estado: EstadoVerificacion): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.tipoUsuario !== TipoUsuario.ADMINISTRADOR) {
        throw new Error('No autorizado');
      }

      // Buscar y actualizar médico
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

  /**
   * Generar ID único
   */
  private generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Calcular distancia entre dos puntos (fórmula de Haversine simplificada)
   */
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}