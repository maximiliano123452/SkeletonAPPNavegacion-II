import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

export interface ConsejosBienestar {
  consejo: string;
  categoria: 'mental' | 'fisico' | 'nutricional' | 'espiritual';
  autor: string;
  fecha: Date;
  icono: string;
}

export interface EjercicioRelajacion {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  instrucciones: string[];
  tipo: 'respiracion' | 'meditacion' | 'estiramiento';
  icono: string;
  dificultad: 'facil' | 'medio' | 'dificil';
}

export interface RegistroEstadoAnimo {
  fecha: Date;
  nivel: number; // 1-10
  notas: string;
  actividades: string[];
  timestamp: number;
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
      fecha: new Date(),
      icono: 'leaf'
    },
    {
      consejo: "Camina al menos 30 minutos diarios. Es una medicina natural para tu corazón.",
      categoria: 'fisico',
      autor: 'Dra. Vida Saludable',
      fecha: new Date(),
      icono: 'walk'
    },
    {
      consejo: "Come un arcoíris: incluye frutas y verduras de diferentes colores en tu día.",
      categoria: 'nutricional',
      autor: 'Nutricionista Elena',
      fecha: new Date(),
      icono: 'nutrition'
    },
    {
      consejo: "Practica la gratitud: escribe 3 cosas por las que estés agradecido hoy.",
      categoria: 'espiritual',
      autor: 'Coach Miguel',
      fecha: new Date(),
      icono: 'heart-outline'
    },
    {
      consejo: "Duerme entre 7-9 horas diarias. El sueño es fundamental para tu bienestar.",
      categoria: 'fisico',
      autor: 'Dr. Sueño',
      fecha: new Date(),
      icono: 'moon'
    },
    {
      consejo: "Practica la técnica 5-4-3-2-1 para reducir la ansiedad: 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas.",
      categoria: 'mental',
      autor: 'Psicólogo Paz',
      fecha: new Date(),
      icono: 'eye'
    },
    {
      consejo: "Bebe al menos 8 vasos de agua al día. La hidratación es clave para tu energía.",
      categoria: 'fisico',
      autor: 'Dra. Hidratación',
      fecha: new Date(),
      icono: 'water'
    }
  ];

  private ejerciciosRelajacion: EjercicioRelajacion[] = [
    {
      id: '1',
      nombre: "Respiración 4-7-8",
      descripcion: "Técnica de respiración para reducir la ansiedad y mejorar el sueño",
      duracion: 5,
      instrucciones: [
        "Siéntate cómodamente con la espalda recta",
        "Coloca la punta de tu lengua detrás de tus dientes frontales superiores",
        "Exhala completamente por la boca",
        "Inhala por la nariz contando hasta 4",
        "Mantén la respiración contando hasta 7",
        "Exhala por la boca contando hasta 8",
        "Repite el ciclo 3-4 veces"
      ],
      tipo: 'respiracion',
      icono: 'leaf',
      dificultad: 'facil'
    },
    {
      id: '2',
      nombre: "Meditación de Atención Plena",
      descripcion: "Ejercicio para centrar la mente en el momento presente",
      duracion: 10,
      instrucciones: [
        "Encuentra un lugar tranquilo y siéntate cómodamente",
        "Cierra los ojos suavemente",
        "Concéntrate en tu respiración natural",
        "Observa tus pensamientos sin juzgarlos",
        "Cuando tu mente divague, vuelve suavemente a la respiración",
        "Mantén esta práctica durante 10 minutos",
        "Termina abriendo lentamente los ojos"
      ],
      tipo: 'meditacion',
      icono: 'flower',
      dificultad: 'medio'
    },
    {
      id: '3',
      nombre: "Estiramiento de Cuello y Hombros",
      descripcion: "Alivia la tensión acumulada en cuello y hombros",
      duracion: 8,
      instrucciones: [
        "Siéntate derecho en una silla",
        "Inclina suavemente la cabeza hacia la derecha",
        "Mantén 15 segundos, regresa al centro",
        "Inclina hacia la izquierda, mantén 15 segundos",
        "Rota los hombros hacia atrás 10 veces",
        "Rota hacia adelante 10 veces",
        "Repite toda la secuencia 2 veces"
      ],
      tipo: 'estiramiento',
      icono: 'body',
      dificultad: 'facil'
    },
    {
      id: '4',
      nombre: "Meditación Corporal Progresiva",
      descripcion: "Relajación profunda de todo el cuerpo",
      duracion: 15,
      instrucciones: [
        "Acuéstate cómodamente boca arriba",
        "Comienza tensando los músculos de los pies por 5 segundos",
        "Relaja completamente y siente la diferencia",
        "Continúa con pantorrillas, muslos, abdomen",
        "Sigue con brazos, hombros, cuello y rostro",
        "Mantén todo el cuerpo relajado por 2 minutos",
        "Abre los ojos lentamente"
      ],
      tipo: 'meditacion',
      icono: 'bed',
      dificultad: 'medio'
    }
  ];

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

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
  getConsejosPorCategoria(categoria?: string): ConsejosBienestar[] {
    if (!categoria) return this.consejosDiarios;
    return this.consejosDiarios.filter(consejo => consejo.categoria === categoria);
  }

  /**
   * Obtiene ejercicios de relajación
   */
  getEjerciciosRelajacion(): EjercicioRelajacion[] {
    return this.ejerciciosRelajacion;
  }

  /**
   * Obtiene un ejercicio por ID
   */
  getEjercicioPorId(id: string): EjercicioRelajacion | undefined {
    return this.ejerciciosRelajacion.find(ejercicio => ejercicio.id === id);
  }

  /**
   * Obtiene ejercicios por tipo
   */
  getEjerciciosPorTipo(tipo: string): EjercicioRelajacion[] {
    return this.ejerciciosRelajacion.filter(ejercicio => ejercicio.tipo === tipo);
  }

  /**
   * Obtiene un ejercicio aleatorio
   */
  getEjercicioAleatorio(): EjercicioRelajacion {
    const index = Math.floor(Math.random() * this.ejerciciosRelajacion.length);
    return this.ejerciciosRelajacion[index];
  }

  /**
   * Registro de estado de ánimo diario
   */
  async registrarEstadoAnimo(nivel: number, notas: string, actividades: string[] = []) {
    const registro: RegistroEstadoAnimo = {
      fecha: new Date(),
      nivel: nivel,
      notas: notas,
      actividades: actividades,
      timestamp: Date.now()
    };
    
    const registros = await this.getRegistrosEstadoAnimo();
    registros.push(registro);
    await this.storageService.setObject('estadosAnimo', registros);
  }

  /**
   * Obtener historial de estados de ánimo
   */
  async getRegistrosEstadoAnimo(): Promise<RegistroEstadoAnimo[]> {
    const registros = await this.storageService.getObject('estadosAnimo');
    return registros || [];
  }

  /**
   * Obtener estadísticas de bienestar
   */
  async getEstadisticasBienestar() {
    const registros = await this.getRegistrosEstadoAnimo();
    
    if (registros.length === 0) {
      return {
        promedioGeneral: 0,
        tendencia: 'neutral',
        diasRegistrados: 0,
        ultimoRegistro: null
      };
    }

    const promedio = registros.reduce((sum, r) => sum + r.nivel, 0) / registros.length;
    const ultimoRegistro = registros[registros.length - 1];
    
    // Calcular tendencia (últimos 7 días vs anteriores)
    const ahora = new Date().getTime();
    const sieteDias = 7 * 24 * 60 * 60 * 1000;
    
    const recientes = registros.filter(r => (ahora - r.timestamp) <= sieteDias);
    const anteriores = registros.filter(r => (ahora - r.timestamp) > sieteDias);
    
    let tendencia = 'neutral';
    if (recientes.length > 0 && anteriores.length > 0) {
      const promedioReciente = recientes.reduce((sum, r) => sum + r.nivel, 0) / recientes.length;
      const promedioAnterior = anteriores.reduce((sum, r) => sum + r.nivel, 0) / anteriores.length;
      
      if (promedioReciente > promedioAnterior + 0.5) {
        tendencia = 'mejorando';
      } else if (promedioReciente < promedioAnterior - 0.5) {
        tendencia = 'empeorando';
      }
    }

    return {
      promedioGeneral: Math.round(promedio * 10) / 10,
      tendencia,
      diasRegistrados: registros.length,
      ultimoRegistro
    };
  }

  /**
   * Obtener recursos de ayuda en crisis
   */
  async getRecursosAyuda(): Promise<any> {
    return {
      lineasAyuda: [
        { 
          nombre: "Salud Mental Chile", 
          telefono: "600 360 7777", 
          disponible: "24/7",
          descripcion: "Línea gratuita de apoyo psicológico"
        },
        { 
          nombre: "Línea Libre", 
          telefono: "1515", 
          disponible: "24/7",
          descripcion: "Para situaciones de violencia y abuso"
        },
        { 
          nombre: "Fono Drogas", 
          telefono: "1412", 
          disponible: "24/7",
          descripcion: "Apoyo en problemas de drogas y alcohol"
        }
      ],
      centrosAtencion: [
        { 
          nombre: "COSAM", 
          direccion: "Consulta tu comuna", 
          tipo: "Público",
          descripcion: "Centro de Salud Mental Comunitario"
        },
        { 
          nombre: "Clínicas Privadas", 
          direccion: "Varias ubicaciones", 
          tipo: "Privado",
          descripcion: "Atención psicológica y psiquiátrica"
        }
      ],
      aplicacionesRecomendadas: [
        {
          nombre: "Headspace",
          descripcion: "Meditación y mindfulness",
          categoria: "Meditación"
        },
        {
          nombre: "Calm",
          descripcion: "Relajación y sueño",
          categoria: "Relajación"
        }
      ]
    };
  }

  /**
   * Obtener frase motivacional del día
   */
  getFraseMotivacional(): string {
    const frases = [
      "Cada día es una nueva oportunidad para cuidar tu bienestar.",
      "Tu salud mental es tan importante como tu salud física.",
      "Pequeños pasos diarios conducen a grandes cambios.",
      "Respira profundo, eres más fuerte de lo que crees.",
      "Cuidarte a ti mismo no es egoísmo, es necesario.",
      "Cada momento de autocuidado es una inversión en tu futuro.",
      "Tu bienestar emocional merece atención y cuidado."
    ];
    
    const today = new Date().getDay();
    return frases[today % frases.length];
  }
}