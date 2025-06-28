import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ConsejosBienestar {
  consejo: string;
  categoria: 'mental' | 'fisico' | 'nutricional' | 'espiritual';
  autor: string;
  fecha: Date;
}

export interface EjercicioRelajacion {
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  instrucciones: string[];
  tipo: 'respiracion' | 'meditacion' | 'estiramiento';
}

@Injectable({
  providedIn: 'root'
})
export class WellnessService {

  private consejosDiarios: ConsejosBienestar[] = [
    {
      consejo: "Dedica 5 minutos al día a respirar profundamente. Tu mente y cuerpo te lo agradecerán.",
      categoria: 'mental',
      autor: 'Dr. Wellness',
      fecha: new Date()
    },
    {
      consejo: "Camina al menos 30 minutos diarios. Es una medicina natural para tu corazón.",
      categoria: 'fisico',
      autor: 'Dra. Vida Saludable',
      fecha: new Date()
    },
    {
      consejo: "Come un arcoíris: incluye frutas y verduras de diferentes colores en tu día.",
      categoria: 'nutricional',
      autor: 'Nutricionista Elena',
      fecha: new Date()
    },
    {
      consejo: "Practica la gratitud: escribe 3 cosas por las que estés agradecido hoy.",
      categoria: 'espiritual',
      autor: 'Coach Miguel',
      fecha: new Date()
    }
  ];

  private ejerciciosRelajacion: EjercicioRelajacion[] = [
    {
      nombre: "Respiración 4-7-8",
      descripcion: "Técnica de respiración para reducir la ansiedad y mejorar el sueño",
      duracion: 5,
      instrucciones: [
        "Siéntate cómodamente con la espalda recta",
        "Inhala por la nariz contando hasta 4",
        "Mantén la respiración contando hasta 7",
        "Exhala por la boca contando hasta 8",
        "Repite el ciclo 4 veces"
      ],
      tipo: 'respiracion'
    },
    {
      nombre: "Meditación de Atención Plena",
      descripcion: "Ejercicio para centrar la mente en el momento presente",
      duracion: 10,
      instrucciones: [
        "Encuentra un lugar tranquilo y siéntate cómodamente",
        "Cierra los ojos y concéntrate en tu respiración",
        "Observa tus pensamientos sin juzgarlos",
        "Cuando tu mente divague, vuelve suavemente a la respiración",
        "Termina abriendo lentamente los ojos"
      ],
      tipo: 'meditacion'
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el consejo diario de bienestar
   */
  getConsejoDiario(): ConsejosBienestar {
    const today = new Date().getDay();
    return this.consejosDiarios[today % this.consejosDiarios.length];
  }

  /**
   * Obtiene todos los consejos por categoría
   */
  getConsejosPorCategoria(categoria: string): ConsejosBienestar[] {
    return this.consejosDiarios.filter(consejo => consejo.categoria === categoria);
  }

  /**
   * Obtiene ejercicios de relajación
   */
  getEjerciciosRelajacion(): EjercicioRelajacion[] {
    return this.ejerciciosRelajacion;
  }

  /**
   * Obtiene un ejercicio aleatorio
   */
  getEjercicioAleatorio(): EjercicioRelajacion {
    const index = Math.floor(Math.random() * this.ejerciciosRelajacion.length);
    return this.ejerciciosRelajacion[index];
  }

  /**
   * Integración con API externa de salud mental (ejemplo)
   */
  async getRecursosAyuda(): Promise<any> {
    try {
      // Simulación de API externa
      return {
        lineasAyuda: [
          { nombre: "Salud Mental Chile", telefono: "600 360 7777", disponible: "24/7" },
          { nombre: "Línea Libre", telefono: "1515", disponible: "24/7" }
        ],
        centrosAtencion: [
          { nombre: "COSAM", direccion: "Consulta tu comuna", tipo: "Público" },
          { nombre: "Clínicas Privadas", direccion: "Varias ubicaciones", tipo: "Privado" }
        ]
      };
    } catch (error) {
      console.error('Error obteniendo recursos:', error);
      return null;
    }
  }

  /**
   * Registro de estado de ánimo diario
   */
  registrarEstadoAnimo(nivel: number, notas: string) {
    const registro = {
      fecha: new Date(),
      nivel: nivel, // 1-10
      notas: notas,
      timestamp: Date.now()
    };
    
    // Guardar en localStorage
    const registros = this.getRegistrosEstadoAnimo();
    registros.push(registro);
    localStorage.setItem('estadosAnimo', JSON.stringify(registros));
  }

  /**
   * Obtener historial de estados de ánimo
   */
  getRegistrosEstadoAnimo(): any[] {
    const registros = localStorage.getItem('estadosAnimo');
    return registros ? JSON.parse(registros) : [];
  }
}