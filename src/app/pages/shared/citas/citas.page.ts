import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { CitasService, Cita } from '../../../services/citas.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  standalone: false,
})
export class CitasPage implements OnInit {

  citas: Cita[] = [];
  usuario: any;

  constructor(
    private citasService: CitasService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    this.cargarCitas();
  }

  async cargarCitas() {
    const loading = await this.loadingController.create({
      message: 'Cargando citas...'
    });
    await loading.present();

    try {
      this.citas = await this.citasService.getCitasPorPaciente(this.usuario.id);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      this.mostrarToast('Error al cargar citas', 'danger');
    }
  }

  async cancelarCita(cita: Cita) {
    const alert = await this.alertController.create({
      header: '¿Cancelar cita?',
      message: `¿Estás seguro de cancelar la cita con ${cita.medicoNombre}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: async () => {
            await this.citasService.cancelarCita(cita.id);
            this.mostrarToast('Cita cancelada', 'warning');
            this.cargarCitas();
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}

