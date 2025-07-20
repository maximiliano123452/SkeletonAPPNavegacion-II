import { Component, OnInit } from '@angular/core';
import { Medico, EstadoVerificacion } from '../../../models/user.models';
import { AuthService } from '../../../services/auth.service';
import { CitasService, Cita } from '../../../services/citas.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-medicos',
  templateUrl: './buscar-medicos.page.html',
  styleUrls: ['./buscar-medicos.page.scss'],
  standalone: false,
})
export class BuscarMedicosPage implements OnInit {

  medicos: Medico[] = [];
  usuario: any;

  constructor(
    private authService: AuthService,
    private citasService: CitasService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    this.buscarMedicos();
  }

  async buscarMedicos() {
    const loading = await this.loadingController.create({
      message: 'Buscando médicos...'
    });
    await loading.present();

    this.medicos = await this.authService.buscarMedicosPorUbicacion(0, 0, 5000); // Busca todos

    await loading.dismiss();
  }

  async agendarCita(medico: Medico) {
    const alert = await this.alertController.create({
      header: 'Agendar Cita',
      message: `¿Deseas agendar una cita con el Dr(a). ${medico.nombre} ${medico.apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agendar',
          handler: async () => {
            const nuevaCita: Cita = {
              id: '',
              pacienteId: this.usuario.id,
              medicoId: medico.id || 'user_' + medico.email, // fallback si no tiene id
              medicoNombre: `${medico.nombre} ${medico.apellido}`,
              especialidad: medico.especialidad || 'General',
              fecha: new Date().toISOString().split('T')[0],
              hora: '10:00' // ejemplo estático
            };

            await this.citasService.agendarCita(nuevaCita);
            this.mostrarToast('Cita agendada con éxito', 'success');
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
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}

