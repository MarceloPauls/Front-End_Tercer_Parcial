import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { Restaurante } from '../../core/models/restaurante.model';
import { Zona } from '../../core/models/zona.model';
import { Mesa } from '../../core/models/mesa.model';
import { Reserva } from '../../core/models/reserva.model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export interface ReservaEnriquecida extends Reserva {
  nombreRestaurante: string;
  nombreZona: string;
  numeroMesa: number;
}

@Component({
  selector: 'app-listar-reservas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './listar-reservas.html',
  styleUrl: './listar-reservas.css'
})
export class ListarReservas implements OnInit {

  formFiltros: FormGroup;

  restaurantes: Restaurante[] = [];
  zonasDelRestaurante: Zona[] = [];

  private mapaRestaurantes = new Map<string, string>(); 
  private mapaZonas = new Map<string, { nombre: string, idRestaurante: string }>();
  private mapaMesas = new Map<string, { numero: number, idZona: string }>(); 

  reservasMostradas: ReservaEnriquecida[] = [];

  constructor(
    private fb: FormBuilder,
    private storage: StorageService
  ) {
    this.formFiltros = this.fb.group({
      restaurante: [null],
      zona: [null],
      fecha: [null] 
    });
  }

  ngOnInit(): void {
    this.cargarDatosMaestros();
    this.setupDropdownListeners();
    this.aplicarFiltros();
  }

  cargarDatosMaestros(): void {
    this.restaurantes = this.storage.getRestaurantes();
    this.restaurantes.forEach(r => this.mapaRestaurantes.set(r.id, r.nombre));

    const zonas = this.storage.getZonas();
    zonas.forEach(z => this.mapaZonas.set(z.id, { nombre: z.nombre, idRestaurante: z.idRestaurante }));

    const mesas = this.storage.getMesas();
    mesas.forEach(m => this.mapaMesas.set(m.id, { numero: m.numero, idZona: m.idZona }));
  }

  setupDropdownListeners(): void {
    this.formFiltros.get('restaurante')?.valueChanges.subscribe(idRestaurante => {
      this.zonasDelRestaurante = [];
      this.formFiltros.get('zona')?.reset(undefined, { emitEvent: false });
      
      if (idRestaurante) {
        const zonas = this.storage.getZonasByRestaurante(idRestaurante);
        this.zonasDelRestaurante = zonas;
      }
    });
  }

  aplicarFiltros(): void {
    const { restaurante, zona, fecha } = this.formFiltros.value;
    
    const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-PY') : undefined;

    const reservas = this.storage.getReservasFiltradas(restaurante, zona, fechaFormateada);

    this.reservasMostradas = reservas.map(reserva => {
      const mesa = this.mapaMesas.get(reserva.idMesaAsignada);
      const zona = mesa ? this.mapaZonas.get(mesa.idZona) : undefined;
      const restaurante = zona ? this.mapaRestaurantes.get(zona.idRestaurante) : undefined;

      return {
        ...reserva,
        numeroMesa: mesa?.numero || 0,
        nombreZona: zona?.nombre || 'Zona Desconocida',
        nombreRestaurante: restaurante || 'Rest. Desconocido'
      };
    });
  }

  limpiarFiltros(): void {
    this.formFiltros.reset();
    this.zonasDelRestaurante = [];
    this.aplicarFiltros();
  }

  borrarReserva(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      this.storage.deleteReserva(id);
      this.aplicarFiltros();
    }
  }
}