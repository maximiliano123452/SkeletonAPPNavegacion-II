import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  perfilForm!: FormGroup;
  usuario: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    this.initForm();
  }

  initForm() {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.usuario.apellido, [Validators.required, Validators.minLength(2)]],
      telefono: [this.usuario.telefono, [Validators.required, Validators.pattern(/^[0-9+\-\s]+$/)]],
      fechaNacimiento: [this.usuario.fechaNacimiento, Validators.required]
    });
  }

  async guardarCambios() {
    if (this.perfilForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Guardando cambios...'
      });
      await loading.present();

      try {
        const pacienteActualizado = {
          ...this.usuario,
          ...this.perfilForm.value
        };

        await this.authService.actualizarPerfilPaciente(pacienteActualizado);

        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Perfil actualizado correctamente',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        // Redirigir al home
        this.router.navigate(['/home']);

      } catch (error) {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Error al actualizar el perfil',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }
}

