import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Interfaces
export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export interface Horarios {
  lunes_viernes: string;
  sabado: string;
  domingo: string;
}

export interface Farmacia {
  id: string;
  nombre: string;
  cadena: string;
  direccion: string;
  telefono: string;
  coordenadas: Coordenadas;
  horarios: Horarios;
  servicios: string[];
  turno: boolean;
  abierto: boolean; // Agregada esta propiedad
  distancia?: number;
}

export interface Medicamento {
  id: string;
  nombre: string;
  principioActivo: string;
  categoria: string;
  tipo: 'receta' | 'libre';
  descripcion: string;
  precio?: number;
}

export interface DisponibilidadMedicamento {
  disponible: boolean;
  precio?: number;
  stock?: number;
  farmaciaId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {
  
  private baseUrl = 'https://api.ejemplo.com'; // Reemplazar con tu API real
  
  // Datos mock para desarrollo
  private farmaciasMock: Farmacia[] = [
    {
      id: '1',
      nombre: 'Farmacia Central',
      cadena: 'Farmacia Independiente',
      direccion: 'Av. Principal 123, Centro',
      telefono: '+56912345678',
      coordenadas: { latitude: -33.4489, longitude: -70.6693 },
      horarios: {
        lunes_viernes: '08:00 - 22:00',
        sabado: '09:00 - 20:00',
        domingo: '10:00 - 18:00'
      },
      servicios: ['Entrega a domicilio', 'Medición de presión', 'Inyecciones'],
      turno: false,
      abierto: true
    },
    {
      id: '2',
      nombre: 'Farmacia 24 Horas',
      cadena: 'Cruz Verde',
      direccion: 'Calle Salud 456, Las Condes',
      telefono: '+56987654321',
      coordenadas: { latitude: -33.4150, longitude: -70.6087 },
      horarios: {
        lunes_viernes: '24 horas',
        sabado: '24 horas',
        domingo: '24 horas'
      },
      servicios: ['Farmacia 24h', 'Entrega a domicilio', 'Laboratorio clínico'],
      turno: true,
      abierto: true
    },
    {
      id: '3',
      nombre: 'Farmacia del Hospital',
      cadena: 'Salcobrand',
      direccion: 'Hospital Regional 789, Providencia',
      telefono: '+56955555555',
      coordenadas: { latitude: -33.4378, longitude: -70.6504 },
      horarios: {
        lunes_viernes: '07:00 - 23:00',
        sabado: '08:00 - 22:00',
        domingo: '09:00 - 21:00'
      },
      servicios: ['Vacunación', 'Medición de presión', 'Laboratorio clínico'],
      turno: false,
      abierto: true
    },
    {
      id: '4',
      nombre: 'Farmacia Norte',
      cadena: 'Ahumada',
      direccion: 'Av. Norte 321, Recoleta',
      telefono: '+56933333333',
      coordenadas: { latitude: -33.4260, longitude: -70.6344 },
      horarios: {
        lunes_viernes: '08:30 - 21:30',
        sabado: '09:00 - 19:00',
        domingo: 'Cerrado'
      },
      servicios: ['Entrega a domicilio', 'Inyecciones'],
      turno: false,
      abierto: false // Ejemplo de farmacia cerrada
    },
    {
      id: '5',
      nombre: 'Farmacia Express',
      cadena: 'Dr. Simi',
      direccion: 'Mall Plaza 555, Maipú',
      telefono: '+56944444444',
      coordenadas: { latitude: -33.5132, longitude: -70.7581 },
      horarios: {
        lunes_viernes: '10:00 - 22:00',
        sabado: '10:00 - 22:00',
        domingo: '11:00 - 20:00'
      },
      servicios: ['Entrega a domicilio', 'Farmacia 24h'],
      turno: false,
      abierto: true
    }
  ];

  private medicamentosMock: Medicamento[] = [
    {
      id: '1',
      nombre: 'Paracetamol 500mg',
      principioActivo: 'Paracetamol',
      categoria: 'Analgésicos',
      tipo: 'libre',
      descripcion: 'Analgésico y antipirético para dolores leves a moderados',
      precio: 2500
    },
    {
      id: '2',
      nombre: 'Ibuprofeno 400mg',
      principioActivo: 'Ibuprofeno',
      categoria: 'Antiinflamatorios',
      tipo: 'libre',
      descripcion: 'Antiinflamatorio no esteroideo para dolor e inflamación',
      precio: 3200
    },
    {
      id: '3',
      nombre: 'Amoxicilina 500mg',
      principioActivo: 'Amoxicilina',
      categoria: 'Antibióticos',
      tipo: 'receta',
      descripcion: 'Antibiótico de amplio espectro para infecciones bacterianas',
      precio: 8500
    },
    {
      id: '4',
      nombre: 'Loratadina 10mg',
      principioActivo: 'Loratadina',
      categoria: 'Antihistamínicos',
      tipo: 'libre',
      descripcion: 'Antihistamínico para alergias y rinitis',
      precio: 4200
    }
  ];

  constructor(private http: HttpClient) {}

  // Obtener todas las farmacias
  async getFarmacias(): Promise<Farmacia[]> {
    try {
      // En producción, usar: return this.http.get<Farmacia[]>(`${this.baseUrl}/farmacias`).toPromise();
      
      // Mock para desarrollo
      await this.delay(1000); // Simular carga
      return this.farmaciasMock.map(farmacia => ({
        ...farmacia,
        abierto: this.calcularSiEstaAbierto(farmacia)
      }));
    } catch (error) {
      console.error('Error obteniendo farmacias:', error);
      throw error;
    }
  }

  // Obtener farmacias cercanas
  async getFarmaciasCercanas(radioKm: number = 5): Promise<Farmacia[]> {
    try {
      const farmacias = await this.getFarmacias();
      
      // Mock: calcular distancias ficticias
      return farmacias.map(farmacia => ({
        ...farmacia,
        distancia: Math.random() * radioKm
      })).sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
      
    } catch (error) {
      console.error('Error obteniendo farmacias cercanas:', error);
      throw error;
    }
  }

  // Obtener farmacias de turno
  async getFarmaciasDeTurno(): Promise<Farmacia[]> {
    try {
      const farmacias = await this.getFarmacias();
      return farmacias.filter(farmacia => farmacia.turno);
    } catch (error) {
      console.error('Error obteniendo farmacias de turno:', error);
      throw error;
    }
  }

  // Obtener farmacias por servicio
  async getFarmaciasPorServicio(servicio: string): Promise<Farmacia[]> {
    try {
      const farmacias = await this.getFarmacias();
      const servicioMap: { [key: string]: string } = {
        '24h': 'Farmacia 24h',
        'entrega': 'Entrega a domicilio',
        'laboratorio': 'Laboratorio clínico',
        'vacunacion': 'Vacunación'
      };
      
      const servicioCompleto = servicioMap[servicio] || servicio;
      return farmacias.filter(farmacia => 
        farmacia.servicios.includes(servicioCompleto)
      );
    } catch (error) {
      console.error('Error obteniendo farmacias por servicio:', error);
      throw error;
    }
  }

  // Buscar farmacias por nombre
  async buscarFarmacias(termino: string): Promise<Farmacia[]> {
    try {
      const farmacias = await this.getFarmacias();
      const terminoLower = termino.toLowerCase();
      
      return farmacias.filter(farmacia =>
        farmacia.nombre.toLowerCase().includes(terminoLower) ||
        farmacia.cadena.toLowerCase().includes(terminoLower) ||
        farmacia.direccion.toLowerCase().includes(terminoLower)
      );
    } catch (error) {
      console.error('Error buscando farmacias:', error);
      throw error;
    }
  }

  // Buscar medicamentos
  buscarMedicamentos(termino: string): Medicamento[] {
    const terminoLower = termino.toLowerCase();
    return this.medicamentosMock.filter(medicamento =>
      medicamento.nombre.toLowerCase().includes(terminoLower) ||
      medicamento.principioActivo.toLowerCase().includes(terminoLower)
    );
  }

  // Verificar disponibilidad de medicamento en farmacia
  async verificarDisponibilidad(farmaciaId: string, medicamento: string): Promise<DisponibilidadMedicamento> {
    try {
      await this.delay(500); // Simular consulta a API
      
      // Mock: generar disponibilidad aleatoria
      const disponible = Math.random() > 0.3; // 70% de probabilidad de disponibilidad
      
      return {
        disponible,
        precio: disponible ? Math.floor(Math.random() * 10000) + 1000 : undefined,
        stock: disponible ? Math.floor(Math.random() * 50) + 1 : undefined,
        farmaciaId
      };
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      throw error;
    }
  }

  // Obtener farmacia por ID
  async getFarmaciaPorId(id: string): Promise<Farmacia | undefined> {
    try {
      const farmacias = await this.getFarmacias();
      return farmacias.find(farmacia => farmacia.id === id);
    } catch (error) {
      console.error('Error obteniendo farmacia por ID:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  private calcularSiEstaAbierto(farmacia: Farmacia): boolean {
    // Mock: retornar estado aleatorio, en producción calcular según horarios reales
    if (farmacia.servicios.includes('Farmacia 24h')) {
      return true;
    }
    
    const hora = new Date().getHours();
    return hora >= 8 && hora <= 22;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener estadísticas de farmacias
  async getEstadisticas(): Promise<any> {
    try {
      const farmacias = await this.getFarmacias();
      return {
        total: farmacias.length,
        abiertas: farmacias.filter(f => f.abierto).length,
        deTurno: farmacias.filter(f => f.turno).length,
        con24h: farmacias.filter(f => f.servicios.includes('Farmacia 24h')).length,
        conDelivery: farmacias.filter(f => f.servicios.includes('Entrega a domicilio')).length
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}