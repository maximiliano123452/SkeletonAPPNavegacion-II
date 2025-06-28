import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { TipoUsuario } from '../../models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.initForm();
  }

  ngOnInit() {}

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...'
      });
      await loading.present();

      try {
        const credentials = this.loginForm.value;
        const user = await this.authService.login(credentials);
        
        await loading.dismiss();
        await this.showToast('Bienvenido de vuelta', 'success');
        
        // Redirigir según el tipo de usuario
        this.redirectToUserHome(user.tipoUsuario);
        
      } catch (error: any) {
        await loading.dismiss();
        await this.showToast(error.message || 'Error en el login', 'danger');
      }
    } else {
      await this.showToast('Por favor, complete todos los campos correctamente', 'warning');
    }
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

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  goToRegister() {
    this.router.navigate(['/registro']);
  }

  // Getters para validaciones
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}