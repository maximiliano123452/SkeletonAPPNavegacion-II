import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredRole = route.data['role'] as TipoUsuario;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (currentUser.tipoUsuario !== requiredRole) {
      // Redirige según el tipo de usuario actual
      this.redirectToUserHome(currentUser.tipoUsuario);
      return false;
    }

    return true;
  }

  private redirectToUserHome(tipoUsuario: TipoUsuario) {
    switch (tipoUsuario) {
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