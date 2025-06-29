import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { TipoUsuario } from '../../models/user.models';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false
})
export class SideMenuComponent implements OnInit {

  usuario: any = null;
  menuItems: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.loadUser();
    this.setupMenuItems();
  }

  loadUser() {
    this.usuario = this.authService.getCurrentUser();
  }

  setupMenuItems() {
    // Elementos comunes para todos
    const commonItems = [
      {
        title: 'Inicio',
        url: '/home',
        icon: 'home',
        color: 'primary'
      },
      {
        title: 'Bienestar',
        url: '/bienestar',
        icon: 'heart',
        color: 'success'
      },
      {
        title: 'Farmacias',
        url: '/farmacias',
        icon: 'medical',
        color: 'tertiary'
      },
      {
        title: 'Historial Médico',
        url: '/historial-medico',
        icon: 'document-text',
        color: 'warning'
      }
    ];

    // Elementos específicos por tipo de usuario
    if (this.usuario) {
      switch (this.usuario.tipoUsuario) {
        case TipoUsuario.MEDICO:
          this.menuItems = [
            ...commonItems,
            {
              title: 'Mi Perfil Médico',
              url: '/medico/perfil',
              icon: 'person-circle',
              color: 'success'
            },
            {
              title: 'Mis Citas',
              url: '/citas',
              icon: 'calendar',
              color: 'secondary'
            }
          ];
          break;

        case TipoUsuario.PACIENTE:
          this.menuItems = [
            ...commonItems,
            {
              title: 'Mi Perfil',
              url: '/paciente/perfil',
              icon: 'person-circle',
              color: 'primary'
            },
            {
              title: 'Buscar Médicos',
              url: '/buscar-medicos',
              icon: 'search',
              color: 'secondary'
            },
            {
              title: 'Mis Citas',
              url: '/citas',
              icon: 'calendar',
              color: 'secondary'
            }
          ];
          break;

        case TipoUsuario.ADMINISTRADOR:
          this.menuItems = [
            ...commonItems,
            {
              title: 'Dashboard Admin',
              url: '/admin/dashboard',
              icon: 'shield-checkmark',
              color: 'warning'
            },
            {
              title: 'Gestionar Usuarios',
              url: '/admin/usuarios',
              icon: 'people',
              color: 'danger'
            }
          ];
          break;

        default:
          this.menuItems = commonItems;
      }
    } else {
      this.menuItems = [
        {
          title: 'Iniciar Sesión',
          url: '/login',
          icon: 'log-in',
          color: 'primary'
        },
        {
          title: 'Registrarse',
          url: '/registro',
          icon: 'person-add',
          color: 'success'
        }
      ];
    }
  }

  async navigate(url: string) {
    await this.menuController.close();
    this.router.navigate([url]);
  }

  async logout() {
    await this.menuController.close();
    await this.authService.logout();
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

  get userInitials(): string {
    if (!this.usuario) return 'U';
    return (this.usuario.nombre?.charAt(0) || '') + (this.usuario.apellido?.charAt(0) || '');
  }
}
