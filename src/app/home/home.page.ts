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
      }
    }
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
}
