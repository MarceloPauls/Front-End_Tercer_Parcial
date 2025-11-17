import { Injectable } from '@angular/core';
import { Restaurante } from '../models/restaurante.model';
import { Zona } from '../models/zona.model';
import { Mesa } from '../models/mesa.model';
import { Reserva } from '../models/reserva.model';

const RESTAURANTES_KEY = 'restaurantes';
const ZONAS_KEY = 'zonas';
const MESAS_KEY = 'mesas';
const RESERVAS_KEY = 'reservas';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private saveData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadData(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  
  private generateId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }
  
  getRestaurantes(): Restaurante[] {
    return this.loadData(RESTAURANTES_KEY);
  }
  
  addRestaurante(nombre: string): boolean { 
    const restaurantes = this.getRestaurantes();
    
    const nombreNormalizado = nombre.trim().toLowerCase();
    const yaExiste = restaurantes.some(
      r => r.nombre.trim().toLowerCase() === nombreNormalizado
    );

    if (yaExiste) {
      return false;
    }

    const nuevoRestaurante: Restaurante = {
      id: this.generateId(),
      nombre: nombre.trim() 
    };
    restaurantes.push(nuevoRestaurante);
    this.saveData(RESTAURANTES_KEY, restaurantes);
    return true;
  }
  
  updateRestaurante(id: string, nombre: string): void {
    const restaurantes = this.getRestaurantes();
    const index = restaurantes.findIndex(r => r.id === id);
    if (index !== -1) {
      restaurantes[index].nombre = nombre;
      this.saveData(RESTAURANTES_KEY, restaurantes);
    }
  }

  deleteRestaurante(id: string): void {
    const zonasParaBorrar = this.getZonasByRestaurante(id);
    zonasParaBorrar.forEach(zona => {
      this.deleteZona(zona.id);
    });
  
    let restaurantes = this.getRestaurantes();
    restaurantes = restaurantes.filter(r => r.id !== id);
    this.saveData(RESTAURANTES_KEY, restaurantes);
  }
  
  getZonas(): Zona[] {
    return this.loadData(ZONAS_KEY);
  }
  
  getZonasByRestaurante(idRestaurante: string): Zona[] {
    return this.getZonas().filter(z => z.idRestaurante === idRestaurante);
  }

  addZona(nombre: string, idRestaurante: string): boolean { 
    const zonas = this.getZonas();
    
    const nombreNormalizado = nombre.trim().toLowerCase();
    const yaExiste = zonas.some(
      z => z.idRestaurante === idRestaurante && 
           z.nombre.trim().toLowerCase() === nombreNormalizado
    );

    if (yaExiste) {
      return false;
    }

    const nuevaZona: Zona = {
      id: this.generateId(),
      nombre: nombre.trim(),
      idRestaurante: idRestaurante,
      horariosDisponibles: [] 
    };
    zonas.push(nuevaZona);
    this.saveData(ZONAS_KEY, zonas);
    return true;
  }
  
  updateZona(id: string, nombre: string): void {
    const zonas = this.getZonas();
    const index = zonas.findIndex(z => z.id === id);
    if (index !== -1) {
      zonas[index].nombre = nombre;
      this.saveData(ZONAS_KEY, zonas);
    }
  }
  
  deleteZona(id: string): void {
    const mesasParaBorrar = this.getMesasByZona(id);
    mesasParaBorrar.forEach(mesa => {
      this.deleteMesa(mesa.id);
    });
    
    let zonas = this.getZonas();
    zonas = zonas.filter(z => z.id !== id);
    this.saveData(ZONAS_KEY, zonas);
  }


  updateHorariosZona(idZona: string, horarios: string[]): void {
    const zonas = this.getZonas();
    const index = zonas.findIndex(z => z.id === idZona);
    if (index !== -1) {
      zonas[index].horariosDisponibles = horarios;
      this.saveData(ZONAS_KEY, zonas);
    }
  }

  
  getMesas(): Mesa[] {
    return this.loadData(MESAS_KEY);
  }
  
  getMesasByZona(idZona: string): Mesa[] {
    return this.getMesas().filter(m => m.idZona === idZona);
  }
  
  addMesa(numero: number, capacidad: number, idZona: string): boolean { 
    const mesas = this.getMesas();
    
    const yaExiste = mesas.some(
      m => m.idZona === idZona && m.numero === numero
    );
 
    if (yaExiste) {
      return false;
    }

    const nuevaMesa: Mesa = {
      id: this.generateId(),
      numero: numero,
      capacidad: capacidad,
      idZona: idZona
    };
    mesas.push(nuevaMesa);
    this.saveData(MESAS_KEY, mesas);
    return true;
  }

  updateMesa(id: string, numero: number, capacidad: number): void {
    const mesas = this.getMesas();
    const index = mesas.findIndex(m => m.id === id);
    if (index !== -1) {
      mesas[index].numero = numero;
      mesas[index].capacidad = capacidad;
      this.saveData(MESAS_KEY, mesas);
    }
  }

  deleteMesa(id: string): void {
    let reservas = this.getReservas();
    reservas = reservas.filter(r => r.idMesaAsignada !== id);
    this.saveData(RESERVAS_KEY, reservas);
    
    let mesas = this.getMesas();
    mesas = mesas.filter(m => m.id !== id);
    this.saveData(MESAS_KEY, mesas);
  }
  
  getReservas(): Reserva[] {
    return this.loadData(RESERVAS_KEY);
  }

  addReserva(reserva: Omit<Reserva, 'id'>): void {
    const reservas = this.getReservas();
    const nuevaReserva: Reserva = {
      ...reserva,
      id: this.generateId()
    };
    reservas.push(nuevaReserva);
    this.saveData(RESERVAS_KEY, reservas);
  }
  
  deleteReserva(id: string): void {
    let reservas = this.getReservas();
    reservas = reservas.filter(r => r.id !== id);
    this.saveData(RESERVAS_KEY, reservas);
  }

  getReservasFiltradas(idRestaurante?: string, idZona?: string, fecha?: string): Reserva[] {
    let reservas = this.getReservas();
    
    if (fecha) {
      reservas = reservas.filter(r => r.fecha === fecha);
    }

    if (!idRestaurante && !idZona) {
      return reservas;
    }

    const mesas = this.getMesas();
    const zonas = this.getZonas();
    
    const mapaMesas = new Map<string, { idZona: string, idRestaurante: string }>();
    mesas.forEach(mesa => {
      const zona = zonas.find(z => z.id === mesa.idZona);
      if (zona) {
        mapaMesas.set(mesa.id, { idZona: zona.id, idRestaurante: zona.idRestaurante });
      }
    });

    if (idZona) {
      reservas = reservas.filter(r => {
        const infoMesa = mapaMesas.get(r.idMesaAsignada);
        return infoMesa && infoMesa.idZona === idZona;
      });
    }

    if (idRestaurante) {
      reservas = reservas.filter(r => {
        const infoMesa = mapaMesas.get(r.idMesaAsignada);
        return infoMesa && infoMesa.idRestaurante === idRestaurante;
      });
    }

    return reservas;
  }
}