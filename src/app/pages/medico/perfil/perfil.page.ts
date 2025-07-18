import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { GeolocationService, Coordenadas } from '../../../services/geolocation.service';
import { CameraService } from '../../../services/camera.service';
import { AuthService } from '../../../services/auth.service';
import { Medico, EstadoVerificacion } from '../../../models/user.models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  medicoForm!: FormGroup;
  fotoPerfil: string = '';
  ubicacionActual: Coordenadas | null = null;
  cargandoUbicacion = false;
  perfilCompletado = false;

  especialidades = [
    'Medicina General', 'Cardiología', 'Dermatología', 'Neurología', 'Pediatría',
    'Ginecología', 'Traumatología', 'Psiquiatría', 'Oftalmología', 'Otorrinolaringología',
    'Urología', 'Endocrinología', 'Gastroenterología', 'Neumología', 'Reumatología'
  ];

  diasSemana = [
    { value: 'lunes', label: 'Lunes' }, { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' }, { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' }, { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  constructor(
    private fb: FormBuilder,
    private geolocationService: GeolocationService,
    private cameraService: CameraService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.cargarPerfilExistente();
  }

  initForm() {
    this.medicoForm = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      apellido: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]+$/)]],
      fechaNacimiento: ['', Validators.required],
      especialidad: ['', Validators.required],
      numeroLicencia: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      universidad: ['', Validators.required],
      experiencia: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      certificaciones: this.fb.array([]),
      direccionConsultorio: ['', Validators.required],
      tarifaConsulta: ['', [Validators.required, Validators.min(1000)]],
      horarioAtencion: this.fb.group({
        dias: [[], Validators.required],
        horaInicio: ['', Validators.required],
        horaFin: ['', Validators.required]
      })
    });
  }

  get certificaciones() {
    return this.medicoForm.get('certificaciones') as FormArray;
  }

  async cargarPerfilExistente() {
    try {
      const usuario = this.authService.getCurrentUser();
      if (usuario) {
        this.medicoForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono
        });

        const perfilMedico = await this.authService.getPerfilMedico();
        if (perfilMedico) {
          this.cargarDatosCompletos(perfilMedico);
        }
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  }

  cargarDatosCompletos(medico: Medico) {
    this.medicoForm.patchValue({
      telefono: medico.telefono,
      fechaNacimiento: medico.fechaNacimiento,
      especialidad: medico.especialidad,
      numeroLicencia: medico.numeroLicencia,
      universidad: medico.universidad,
      experiencia: medico.experiencia,
      direccionConsultorio: medico.direccionConsultorio,
      tarifaConsulta: medico.tarifaConsulta,
      horarioAtencion: medico.horarioAtencion
    });

    if (medico.certificaciones) {
      medico.certificaciones.forEach(cert =>
        this.certificaciones.push(this.fb.control(cert, Validators.required))
      );
    }

    this.fotoPerfil = medico.fotoPerfil || '';
    this.ubicacionActual = medico.coordenadas ? {
    latitude: medico.coordenadas.latitud,
    longitude: medico.coordenadas.longitud
    } : null;
    this.perfilCompletado = medico.verificado !== EstadoVerificacion.PENDIENTE;
  }

  agregarCertificacion() {
    this.certificaciones.push(this.fb.control('', Validators.required));
  }

  eliminarCertificacion(index: number) {
    this.certificaciones.removeAt(index);
  }

  async mostrarOpcionesFoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar foto de perfil',
      buttons: [
        { text: 'Tomar foto', icon: 'camera', handler: () => this.tomarFoto() },
        { text: 'Seleccionar de galería', icon: 'images', handler: () => this.seleccionarDeGaleria() },
        { text: 'Cancelar', icon: 'close', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async tomarFoto() {
    try {
      this.fotoPerfil = await this.cameraService.tomarFoto();
    } catch (error) {
      await this.mostrarToast('Error al tomar la foto', 'danger');
    }
  }

  async seleccionarDeGaleria() {
    try {
      this.fotoPerfil = await this.cameraService.seleccionarDeGaleria();
    } catch (error) {
      await this.mostrarToast('Error al seleccionar la imagen', 'danger');
    }
  }

  async obtenerUbicacion() {
    this.cargandoUbicacion = true;
    try {
      const posicion = await this.geolocationService.getCurrentPosition();
      this.ubicacionActual = {
        latitude: posicion.latitude,
        longitude: posicion.longitude
      };
      await this.mostrarToast('Ubicación obtenida correctamente', 'success');
    } catch (error: any) {
      await this.mostrarToast(error.message || 'Error obteniendo ubicación', 'danger');
    } finally {
      this.cargandoUbicacion = false;
    }
  }

  async guardarPerfil() {
    if (this.medicoForm.valid && this.fotoPerfil && this.ubicacionActual) {
      const loading = await this.loadingController.create({ message: 'Guardando perfil médico...' });
      await loading.present();

      try {
        const usuario = this.authService.getCurrentUser();
        const medicoData: Medico = {
          ...usuario,
          ...this.medicoForm.value,
          fotoPerfil: this.fotoPerfil,
          coordenadas: {
            latitude: this.ubicacionActual.latitude,
            longitude: this.ubicacionActual.longitude
          },
          certificaciones: this.certificaciones.value,
          verificado: EstadoVerificacion.PENDIENTE,
          fechaRegistro: usuario?.fechaRegistro || new Date(),
          rating: 0,
          totalConsultas: 0
        };

        await this.authService.actualizarPerfilMedico(medicoData);

        await loading.dismiss();
        await this.mostrarToast('Perfil guardado exitosamente. En proceso de verificación.', 'success');
        this.perfilCompletado = true;

      } catch (error: any) {
        await loading.dismiss();
        await this.mostrarToast(error.message || 'Error guardando el perfil', 'danger');
      }
    } else {
      await this.mostrarToast('Complete todos los campos, agregue una foto y obtenga su ubicación', 'warning');
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

  validarHorario(): boolean {
    const horario = this.medicoForm.get('horarioAtencion')?.value;
    if (!horario.horaInicio || !horario.horaFin) return false;

    const inicio = new Date(`2000-01-01 ${horario.horaInicio}`);
    const fin = new Date(`2000-01-01 ${horario.horaFin}`);

    return inicio < fin;
  }

  get formularioValido(): boolean {
    return this.medicoForm.valid &&
      !!this.fotoPerfil &&
      !!this.ubicacionActual &&
      this.validarHorario();
  }

  get estadoVerificacion(): string {
    const usuario = this.authService.getCurrentUser() as Medico;
    if (!usuario || !usuario.verificado) return 'Pendiente';

    switch (usuario.verificado) {
      case EstadoVerificacion.VERIFICADO: return 'Verificado';
      case EstadoVerificacion.RECHAZADO: return 'Rechazado';
      default: return 'Pendiente';
    }
  }

  get colorEstado(): string {
    const estado = this.estadoVerificacion;
    switch (estado) {
      case 'Verificado': return 'success';
      case 'Rechazado': return 'danger';
      default: return 'warning';
    }
  }
}
