import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  ngOnInit() {}

  iniciarSesion() {
    this.authGuard.login(); // Simula autenticación
    this.router.navigate(['/home']); // Redirige a Home
  }
}
