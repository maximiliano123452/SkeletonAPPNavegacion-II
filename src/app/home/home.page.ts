import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  segmento: string = 'experiencia';

  constructor(
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  cerrarSesion() {
    this.authGuard.logout(); // Desactiva el acceso
    this.router.navigate(['/login']); // Redirige al login
  }
}
