import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models/user.models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  usuario: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.cargarUsuario();
  }

  ionViewWillEnter() {
    // Recargar usuario cada vez que se entra a la página
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuario = this.authService.getCurrentUser();
  }

  async logout() {
    await this.authService.logout();
  }

  irAPerfil() {
    if (this.usuario) {
      switch (this.usuario.tipoUsuario) {
        case TipoUsuario.MEDICO:
          this.router.navigate(['/medico/perfil']);
          break;
        case TipoUsuario.PACIENTE:
          this.router.navigate(['/paciente/perfil']);
          break;
        case TipoUsuario.ADMINISTRADOR:
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/home']);
      }
    }
  }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  get tipoUsuarioLabel(): string {
    if (!this.usuario) return '';
    
    switch (this.usuario.tipoUsuario) {
      case TipoUsuario.MEDICO:
        return 'Médico';
      case TipoUsuario.PACIENTE:
        return 'Paciente';
      case TipoUsuario.ADMINISTRADOR:
        return 'Administrador';
      default:
        return 'Usuario';
    }
  }

  // Método para obtener el saludo según la hora
  get saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) {
      return 'Buenos días';
    } else if (hora < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  // Método para obtener el color del chip según el tipo de usuario
  get colorChipUsuario(): string {
    if (!this.usuario) return 'medium';
    
    switch (this.usuario.tipoUsuario) {
      case TipoUsuario.MEDICO:
        return 'success';
      case TipoUsuario.PACIENTE:
        return 'primary';
      case TipoUsuario.ADMINISTRADOR:
        return 'warning';
      default:
        return 'medium';
    }
  }

  // Método para obtener recomendaciones según el tipo de usuario
  get recomendacionesRapidas(): string[] {
    if (!this.usuario) return [];
    
    switch (this.usuario.tipoUsuario) {
      case TipoUsuario.MEDICO:
        return [
          'Complete su perfil médico',
          'Revise sus citas pendientes',
          'Actualice su disponibilidad'
        ];
      case TipoUsuario.PACIENTE:
        return [
          'Busque médicos en su área',
          'Agende su próxima cita',
          'Revise su historial médico'
        ];
      case TipoUsuario.ADMINISTRADOR:
        return [
          'Revise perfiles médicos pendientes',
          'Gestione usuarios del sistema',
          'Verifique reportes del día'
        ];
      default:
        return [];
    }
  }
}