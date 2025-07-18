import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FarmaciasService, Farmacia, Medicamento } from '../../../services/farmacias.service';
import { GeolocationService } from '../../../services/geolocation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-farmacias',
  templateUrl: './farmacias.page.html',
  styleUrls: ['./farmacias.page.scss'],
  standalone: false
})
export class FarmaciasPage implements OnInit {

  farmacias: Farmacia[] = [];
  farmaciasFiltradas: Farmacia[] = [];
  medicamentos: Medicamento[] = [];
  
  vistaActiva = 'lista'; // Vista inicial
  
  terminoBusqueda = '';
  filtroActivo = 'todas';
  
  cargandoFarmacias = false;
  cargandoUbicacion = false;
  
  usuario: any = null;

  filtrosDisponibles = [
    { value: 'todas', label: 'Todas', icon: 'medical' },
    { value: 'cercanas', label: 'Cercanas', icon: 'location' },
    { value: 'turno', label: 'De Turno', icon: 'time' },
    { value: '24h', label: '24 Horas', icon: 'timer' },
    { value: 'entrega', label: 'Delivery', icon: 'car' }
  ];

  serviciosPopulares = [
    'Entrega a domicilio',
    'Farmacia 24h',
    'Medición de presión',
    'Inyecciones',
    'Vacunación',
    'Laboratorio clínico'
  ];

  constructor(
    private farmaciasService: FarmaciasService,
    private geolocationService: GeolocationService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
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
    await this.cargarFarmacias();
  }

  async cargarFarmacias() {
    this.cargandoFarmacias = true;
    
    try {
      this.farmacias = await this.farmaciasService.getFarmacias();
      this.aplicarFiltro(this.filtroActivo);
    } catch (error) {
      await this.mostrarToast('Error cargando farmacias', 'danger');
    } finally {
      this.cargandoFarmacias = false;
    }
  }

  cambiarVista(vista: string | undefined) {
    if (vista) {
      this.vistaActiva = vista;
    }
  }

  async aplicarFiltro(filtro: string | undefined) {
    if (!filtro) return;
    
    this.filtroActivo = filtro;
    this.cargandoFarmacias = true;

    try {
      switch (filtro) {
        case 'todas':
          this.farmaciasFiltradas = this.farmacias;
          break;
        case 'cercanas':
          this.farmaciasFiltradas = await this.farmaciasService.getFarmaciasCercanas(5);
          break;
        case 'turno':
          this.farmaciasFiltradas = await this.farmaciasService.getFarmaciasDeTurno();
          break;
        case '24h':
          this.farmaciasFiltradas = await this.farmaciasService.getFarmaciasPorServicio('24h');
          break;
        case 'entrega':
          this.farmaciasFiltradas = await this.farmaciasService.getFarmaciasPorServicio('entrega');
          break;
        default:
          this.farmaciasFiltradas = this.farmacias;
      }
    } catch (error) {
      await this.mostrarToast('Error aplicando filtro', 'danger');
      this.farmaciasFiltradas = this.farmacias;
    } finally {
      this.cargandoFarmacias = false;
    }
  }

  async buscarFarmacias() {
    if (!this.terminoBusqueda.trim()) {
      this.farmaciasFiltradas = this.farmacias;
      return;
    }

    this.cargandoFarmacias = true;
    
    try {
      this.farmaciasFiltradas = await this.farmaciasService.buscarFarmacias(this.terminoBusqueda);
    } catch (error) {
      await this.mostrarToast('Error en la búsqueda', 'danger');
    } finally {
      this.cargandoFarmacias = false;
    }
  }

  async mostrarDetallesFarmacia(farmacia: Farmacia) {
    const alert = await this.alertController.create({
      header: farmacia.nombre,
      subHeader: farmacia.cadena,
      message: `
        <strong>📍 Dirección:</strong><br>
        ${farmacia.direccion}<br><br>
        
        <strong>📞 Teléfono:</strong><br>
        ${farmacia.telefono}<br><br>
        
        <strong>🕒 Horarios:</strong><br>
        Lun-Vie: ${farmacia.horarios.lunes_viernes}<br>
        Sábado: ${farmacia.horarios.sabado}<br>
        Domingo: ${farmacia.horarios.domingo}<br><br>
        
        <strong>🏥 Servicios:</strong><br>
        ${farmacia.servicios.join(', ')}<br><br>
        
        ${farmacia.distancia ? `<strong>📏 Distancia:</strong><br>${farmacia.distancia.toFixed(1)} km<br><br>` : ''}
        
        ${farmacia.turno ? '<strong>🌙 Farmacia de Turno</strong>' : ''}
      `,
      buttons: [
        { text: 'Cerrar', role: 'cancel' },
        { text: 'Llamar', handler: () => this.llamarFarmacia(farmacia.telefono) },
        { text: 'Cómo llegar', handler: () => this.abrirMapa(farmacia) }
      ]
    });

    await alert.present();
  }

  abrirMapa(farmacia: Farmacia) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${farmacia.coordenadas.latitude},${farmacia.coordenadas.longitude}`;
    window.open(url, '_system');
  }

  llamarFarmacia(telefono: string) {
    window.open(`tel:${telefono}`, '_system');
  }

  async buscarMedicamento() {
    const alert = await this.alertController.create({
      header: 'Buscar Medicamento',
      inputs: [{ name: 'medicamento', type: 'text', placeholder: 'Nombre del medicamento...' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Buscar', handler: (data) => {
            if (data.medicamento.trim()) {
              this.realizarBusquedaMedicamento(data.medicamento);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async realizarBusquedaMedicamento(termino: string) {
    const loading = await this.loadingController.create({ message: 'Buscando medicamento...' });
    await loading.present();

    try {
      this.medicamentos = this.farmaciasService.buscarMedicamentos(termino);
      
      if (this.medicamentos.length === 0) {
        await this.mostrarToast('No se encontraron medicamentos con ese nombre', 'warning');
      } else {
        await this.mostrarResultadosMedicamento();
      }
    } catch (error) {
      await this.mostrarToast('Error buscando medicamento', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async mostrarResultadosMedicamento() {
    let mensaje = '<strong>Medicamentos encontrados:</strong><br><br>';
    
    this.medicamentos.forEach(med => {
      mensaje += `<strong>${med.nombre}</strong><br>`;
      mensaje += `Principio activo: ${med.principioActivo}<br>`;
      mensaje += `Categoría: ${med.categoria}<br>`;
      mensaje += `Tipo: ${med.tipo === 'receta' ? '⚕️ Con receta' : '🆓 Venta libre'}<br>`;
      mensaje += `${med.descripcion}<br><br>`;
    });

    const alert = await this.alertController.create({
      header: 'Resultados de Búsqueda',
      message: mensaje,
      buttons: [
        { text: 'Cerrar', role: 'cancel' },
        { text: 'Buscar en farmacias', handler: () => this.verificarDisponibilidadEnFarmacias(this.medicamentos[0].nombre) }
      ]
    });

    await alert.present();
  }

  async verificarDisponibilidadEnFarmacias(medicamento: string) {
    const loading = await this.loadingController.create({ message: 'Verificando disponibilidad...' });
    await loading.present();

    try {
      const resultados = [];
      
      for (const farmacia of this.farmaciasFiltradas.slice(0, 5)) {
        const disponibilidad = await this.farmaciasService.verificarDisponibilidad(farmacia.id, medicamento);
        resultados.push({ farmacia: farmacia.nombre, ...disponibilidad });
      }

      await this.mostrarDisponibilidad(medicamento, resultados);
    } catch (error) {
      await this.mostrarToast('Error verificando disponibilidad', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async mostrarDisponibilidad(medicamento: string, resultados: any[]) {
    let mensaje = `<strong>Disponibilidad de ${medicamento}:</strong><br><br>`;
    
    resultados.forEach(resultado => {
      if (resultado.disponible) {
        mensaje += `✅ <strong>${resultado.farmacia}</strong><br>`;
        mensaje += `💰 Precio: $${resultado.precio?.toLocaleString()}<br>`;
        mensaje += `📦 Stock: ${resultado.stock} unidades<br><br>`;
      } else {
        mensaje += `❌ <strong>${resultado.farmacia}</strong><br>No disponible<br><br>`;
      }
    });

    const alert = await this.alertController.create({
      header: 'Disponibilidad',
      message: mensaje,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  async obtenerFarmaciasCercanas() {
    this.cargandoUbicacion = true;
    
    try {
      await this.aplicarFiltro('cercanas');
      await this.mostrarToast('Farmacias cercanas actualizadas', 'success');
    } catch (error) {
      await this.mostrarToast('Error obteniendo ubicación', 'danger');
    } finally {
      this.cargandoUbicacion = false;
    }
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

  trackByFarmacia(index: number, farmacia: Farmacia): any {
    return farmacia.id || index;
  }

  get farmaciasMostradas(): Farmacia[] {
    return this.farmaciasFiltradas;
  }

  get totalFarmacias(): number {
    return this.farmaciasFiltradas.length;
  }

  get filtroActual(): string {
    const filtro = this.filtrosDisponibles.find(f => f.value === this.filtroActivo);
    return filtro?.label || 'Todas';
  }

  get hayFarmaciasDeTurno(): boolean {
    return this.farmaciasFiltradas.some(f => f.turno);
  }
}
