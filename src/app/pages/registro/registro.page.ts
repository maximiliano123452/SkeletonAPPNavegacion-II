import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { TipoUsuario } from '../../models/user.models';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  registroForm!: FormGroup;
  tiposUsuario = [
    { value: TipoUsuario.PACIENTE, label: 'Paciente', icon: 'person', color: 'primary' },
    { value: TipoUsuario.MEDICO, label: 'Médico', icon: 'medical', color: 'success' },
    { value: TipoUsuario.ADMINISTRADOR, label: 'Administrador', icon: 'shield-checkmark', color: 'warning' }
  ];
  
  selectedUserType: TipoUsuario | null = null;
  showPassword = false;
  showConfirmPassword = false;

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
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]+$/)]],
      tipoUsuario: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  selectUserType(tipo: TipoUsuario) {
    this.selectedUserType = tipo;
    this.registroForm.patchValue({ tipoUsuario: tipo });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit() {
    if (this.registroForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrando usuario...'
      });
      await loading.present();

      try {
        const formData = this.registroForm.value;
        await this.authService.register(formData);
        
        await loading.dismiss();
        await this.showToast('Usuario registrado exitosamente', 'success');
        
        // 🔄 Redirigir siempre al Home general
        this.router.navigate(['/home']);
        
      } catch (error: any) {
        await loading.dismiss();
        await this.showToast(error.message || 'Error en el registro', 'danger');
      }
    } else {
      await this.showToast('Por favor, complete todos los campos correctamente', 'warning');
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

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Getters para validaciones en template
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  get confirmPassword() { return this.registroForm.get('confirmPassword'); }
  get nombre() { return this.registroForm.get('nombre'); }
  get apellido() { return this.registroForm.get('apellido'); }
  get telefono() { return this.registroForm.get('telefono'); }
}
