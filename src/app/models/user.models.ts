// Enums para tipos de usuario
export enum TipoUsuario {
  MEDICO = 'medico',
  PACIENTE = 'paciente',
  ADMINISTRADOR = 'administrador'
}

export enum EstadoVerificacion {
  PENDIENTE = 'pendiente',
  VERIFICADO = 'verificado',
  RECHAZADO = 'rechazado'
}

// Interface base para todos los usuarios
export interface UsuarioBase {
  id?: string;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNacimiento: Date;
  fotoPerfil?: string;
  tipoUsuario: TipoUsuario;
  activo: boolean;
  fechaRegistro: Date;
  ultimoAcceso?: Date;
}

// Interface específica para médicos
export interface Medico extends UsuarioBase {
  tipoUsuario: TipoUsuario.MEDICO;
  especialidad: string;
  numeroLicencia: string;
  universidad: string;
  experiencia: number;
  certificaciones: string[];
  direccionConsultorio: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  horarioAtencion: {
    dias: string[];
    horaInicio: string;
    horaFin: string;
  };
  tarifaConsulta?: number;
  verificado: EstadoVerificacion;
  rating?: number;
  totalConsultas?: number;
  distancia?: number; // Para búsquedas por ubicación
}

// Interface específica para pacientes
export interface Paciente extends UsuarioBase {
  tipoUsuario: TipoUsuario.PACIENTE;
  rut: string;
  direccion: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  contactoEmergencia: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  alergias?: string[];
  enfermedadesCronicas?: string[];
  medicamentosActuales?: string[];
  tipoSangre?: string;
  seguroMedico?: string;
}

// Interface específica para administradores
export interface Administrador extends UsuarioBase {
  tipoUsuario: TipoUsuario.ADMINISTRADOR;
  permisos: string[];
  nivel: 'super' | 'moderador' | 'soporte';
}

// Interface para login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface para registro inicial
export interface RegistroRequest {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellido: string;
  telefono: string;
  tipoUsuario: TipoUsuario;
}