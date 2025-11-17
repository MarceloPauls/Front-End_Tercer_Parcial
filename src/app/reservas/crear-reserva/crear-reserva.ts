import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { Restaurante } from '../../core/models/restaurante.model';
import { Zona } from '../../core/models/zona.model';
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

@Component({
  selector: 'app-crear-reserva',
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
    MatNativeDateModule
  ],
  templateUrl: './crear-reserva.html',
  styleUrl: './crear-reserva.css'
})
export class CrearReserva implements OnInit {

  formReserva: FormGroup;

  restaurantes: Restaurante[] = [];
  zonasDelRestaurante: Zona[] = [];
  horariosDeLaZona: string[] = [];

  private todasLasZonas: Zona[] = [];
  private zonaSeleccionada: Zona | null = null;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService
  ) {
    this.formReserva = this.fb.group({
      restaurante: ['', Validators.required], // [cite: 55]
      zona: ['', Validators.required],         // [cite: 56]
      fecha: ['', Validators.required],       // [cite: 57]
      hora: ['', Validators.required],         // [cite: 58]
      cantidadPersonas: [1, [Validators.required, Validators.min(1)]], // [cite: 59]
      nombre: ['', Validators.required],      // [cite: 60]
      apellido: ['', Validators.required],    // [cite: 60]
      telefono: ['', Validators.required]     // [cite: 60]
    });
  }

  ngOnInit(): void {
    this.restaurantes = this.storage.getRestaurantes();
    this.todasLasZonas = this.storage.getZonas();
    this.setupDropdownListeners();
  }

  setupDropdownListeners(): void {
    this.formReserva.get('restaurante')?.valueChanges.subscribe(idRestaurante => {
      this.zonasDelRestaurante = this.todasLasZonas.filter(
        z => z.idRestaurante === idRestaurante
      );
      this.formReserva.get('zona')?.reset(undefined, { emitEvent: false });
      this.horariosDeLaZona = [];
      this.zonaSeleccionada = null;
    });
    
    this.formReserva.get('zona')?.valueChanges.subscribe(idZona => {
      this.zonaSeleccionada = this.todasLasZonas.find(z => z.id === idZona) || null;
      this.horariosDeLaZona = this.zonaSeleccionada?.horariosDisponibles.sort() || [];
      this.formReserva.get('hora')?.reset(undefined, { emitEvent: false });
    });
  }

  confirmarReserva(): void {
    if (this.formReserva.invalid) {
      alert('Por favor completa todos los campos.');
      return;
    }
    
    const datos = this.formReserva.value;
    const mesasDeLaZona = this.storage.getMesasByZona(datos.zona);
    const mesasConCapacidad = mesasDeLaZona.filter(
      m => m.capacidad >= datos.cantidadPersonas
    );

    if (mesasConCapacidad.length === 0) {
      alert('Error: No existen mesas con la capacidad suficiente en esta zona.');
      return;
    }

    const fechaFormateada = new Date(datos.fecha).toLocaleDateString('es-PY');
    const reservasExistentes = this.storage.getReservas().filter(
      r => r.fecha === fechaFormateada && r.hora === datos.hora
    );
    
    const idsMesasOcupadas = reservasExistentes.map(r => r.idMesaAsignada);

    mesasConCapacidad.sort((a, b) => a.capacidad - b.capacidad);
    
    const mesaDisponible = mesasConCapacidad.find(
      mesa => !idsMesasOcupadas.includes(mesa.id)
    );
 
    if (mesaDisponible) {
      const nuevaReserva: Omit<Reserva, 'id'> = {
        fecha: fechaFormateada,
        hora: datos.hora,
        cantidadPersonas: datos.cantidadPersonas,
        idMesaAsignada: mesaDisponible.id,
        nombreCliente: datos.nombre,
        apellidoCliente: datos.apellido,
        telefonoCliente: datos.telefono
      };
      
      this.storage.addReserva(nuevaReserva);
      
      alert(`¡Reserva confirmada con éxito!\nRestaurante: ${this.restaurantes.find(r => r.id === datos.restaurante)?.nombre}\nZona: ${this.zonaSeleccionada?.nombre}\nMesa Asignada: N° ${mesaDisponible.numero}`);
      
      this.formReserva.reset();
      this.zonasDelRestaurante = [];
      this.horariosDeLaZona = [];
      this.zonaSeleccionada = null;

    } else {
      alert('Lo sentimos, no hay mesas disponibles para esa fecha y hora con la capacidad solicitada. Todas las mesas aptas ya están reservadas.');
    }
  }
}