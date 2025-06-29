import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { WellnessService, ConsejosBienestar, EjercicioRelajacion, RegistroEstadoAnimo } from '../../../services/wellness.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bienestar',
  templateUrl: './bienestar.page.html',
  styleUrls: ['./bienestar.page.scss'],
  standalone: false
})
export class BienestarPage implements OnInit {

  consejoDiario!: ConsejosBienestar;
  fraseMotivacional!: string;
  ejercicios: EjercicioRelajacion[] = [];
  estadisticas: any = {};
  usuario: any = null;
  
  // Control de vista
  vistaActiva = 'inicio';
  
  // Registro de estado de ánimo
  estadoAnimo = {
    nivel: 5,
    notas: '',
    actividades: [] as string[]
  };

  actividadesDisponibles = [
    'Ejercicio físico',
    'Meditación',
    'Lectura',
    'Música',
    'Tiempo en naturaleza',
    'Socialización',
    'Trabajo creativo',
    'Descanso'
  ];

  categorias = [
    { id: 'mental', nombre: 'Mental', icono: 'brain', color: 'primary' },
    { id: 'fisico', nombre: 'Físico', icono: 'fitness', color: 'success' },
    { id: 'nutricional', nombre: 'Nutricional', icono: 'nutrition', color: 'warning' },
    { id: 'espiritual', nombre: 'Espiritual', icono: 'heart', color: 'tertiary' }
  ];

  constructor(
    private wellnessService: WellnessService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.usuario = this.authService.getCurrentUser();
    this.consejoDiario = this.wellnessService.getConsejoDiario();
    this.fraseMotivacional = this.wellnessService.getFraseMotivacional();
    this.ejercicios = this.wellnessService.getEjerciciosRelajacion();
    this.estadisticas = await this.wellnessService.getEstadisticasBienestar();
  }

  cambiarVista(vista: string | any) {
    this.vistaActiva = typeof vista === 'string' ? vista : vista.toString();
  }

  async registrarEstado() {
    if (this.estadoAnimo.nivel < 1 || this.estadoAnimo.nivel > 10) {
      await this.mostrarToast('Selecciona un nivel entre 1 y 10', 'warning');
      return;
    }

    try {
      await this.wellnessService.registrarEstadoAnimo(
        this.estadoAnimo.nivel,
        this.estadoAnimo.notas,
        this.estadoAnimo.actividades
      );

      await this.mostrarToast('Estado de ánimo registrado exitosamente', 'success');
      
      // Limpiar formulario
      this.estadoAnimo = {
        nivel: 5,
        notas: '',
        actividades: []
      };

      // Recargar estadísticas
      this.estadisticas = await this.wellnessService.getEstadisticasBienestar();
      
    } catch (error) {
      await this.mostrarToast('Error al registrar el estado de ánimo', 'danger');
    }
  }

  toggleActividad(actividad: string) {
    const index = this.estadoAnimo.actividades.indexOf(actividad);
    if (index > -1) {
      this.estadoAnimo.actividades.splice(index, 1);
    } else {
      this.estadoAnimo.actividades.push(actividad);
    }
  }

  isActividadSeleccionada(actividad: string): boolean {
    return this.estadoAnimo.actividades.includes(actividad);
  }

  async iniciarEjercicio(ejercicio: EjercicioRelajacion) {
    const alert = await this.alertController.create({
      header: ejercicio.nombre,
      subHeader: `Duración: ${ejercicio.duracion} minutos`,
      message: ejercicio.descripcion,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Comenzar',
          handler: () => {
            this.mostrarEjercicio(ejercicio);
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarEjercicio(ejercicio: EjercicioRelajacion) {
    let currentStep = 0;
    const totalSteps = ejercicio.instrucciones.length;

    const mostrarPaso = async () => {
      if (currentStep < totalSteps) {
        const alert = await this.alertController.create({
          header: `Paso ${currentStep + 1} de ${totalSteps}`,
          subHeader: ejercicio.nombre,
          message: ejercicio.instrucciones[currentStep],
          buttons: [
            {
              text: 'Salir',
              role: 'cancel'
            },
            {
              text: currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente',
              handler: () => {
                currentStep++;
                if (currentStep < totalSteps) {
                  setTimeout(mostrarPaso, 500);
                } else {
                  this.ejercicioCompletado(ejercicio);
                }
              }
            }
          ]
        });

        await alert.present();
      }
    };

    mostrarPaso();
  }

  async ejercicioCompletado(ejercicio: EjercicioRelajacion) {
    await this.mostrarToast(`¡Excelente! Has completado: ${ejercicio.nombre}`, 'success');
    
    // Opcional: registrar que completó un ejercicio
    const actividadesActualizadas = [...this.estadoAnimo.actividades];
    if (!actividadesActualizadas.includes('Ejercicio de relajación')) {
      actividadesActualizadas.push('Ejercicio de relajación');
    }
  }

  async mostrarRecursosAyuda() {
    const recursos = await this.wellnessService.getRecursosAyuda();
    
    let mensaje = '<strong>Líneas de Ayuda 24/7:</strong><br>';
    recursos.lineasAyuda.forEach((linea: any) => {
      mensaje += `<br>📞 ${linea.nombre}: ${linea.telefono}<br><small>${linea.descripcion}</small><br>`;
    });

    mensaje += '<br><strong>Centros de Atención:</strong><br>';
    recursos.centrosAtencion.forEach((centro: any) => {
      mensaje += `<br>🏥 ${centro.nombre} (${centro.tipo})<br><small>${centro.descripcion}</small><br>`;
    });

    const alert = await this.alertController.create({
      header: 'Recursos de Ayuda',
      message: mensaje,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  getConsejosPorCategoria(categoria: string): ConsejosBienestar[] {
    return this.wellnessService.getConsejosPorCategoria(categoria);
  }

  getEjerciciosPorTipo(tipo: string): EjercicioRelajacion[] {
    return this.wellnessService.getEjerciciosPorTipo(tipo);
  }

  private async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  // Getters para la vista
  get nivelEstadoColor(): string {
    if (this.estadoAnimo.nivel <= 3) return 'danger';
    if (this.estadoAnimo.nivel <= 6) return 'warning';
    return 'success';
  }

  get nivelEstadoTexto(): string {
    if (this.estadoAnimo.nivel <= 2) return 'Muy bajo';
    if (this.estadoAnimo.nivel <= 4) return 'Bajo';
    if (this.estadoAnimo.nivel <= 6) return 'Regular';
    if (this.estadoAnimo.nivel <= 8) return 'Bueno';
    return 'Excelente';
  }

  get tendenciaColor(): string {
    switch (this.estadisticas.tendencia) {
      case 'mejorando': return 'success';
      case 'empeorando': return 'danger';
      default: return 'medium';
    }
  }

  get tendenciaTexto(): string {
    switch (this.estadisticas.tendencia) {
      case 'mejorando': return '📈 Mejorando';
      case 'empeorando': return '📉 Necesita atención';
      default: return '➡️ Estable';
    }
  }
}