export interface HistorialMedico {
  id?: string; // Hacemos ID opcional, se genera en el service
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: string[];
}

