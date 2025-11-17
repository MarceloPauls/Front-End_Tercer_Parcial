import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { Restaurante } from '../../core/models/restaurante.model';
import { Zona } from '../../core/models/zona.model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips'; 

@Component({
  selector: 'app-admin-horarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './admin-horarios.html',
  styleUrl: './admin-horarios.css'
})
export class AdminHorarios implements OnInit {

  formSeleccion: FormGroup;
  formAgregarHorario: FormGroup;

  restaurantes: Restaurante[] = [];
  zonasDelRestaurante: Zona[] = [];
  horariosDeLaZona: string[] = [];

  private idZonaSeleccionada: string | null = null;

  constructor(
    private storage: StorageService,
    private fb: FormBuilder
  ) {
    this.formSeleccion = this.fb.group({
      idRestaurante: [''],
      idZona: ['']
    });

    this.formAgregarHorario = this.fb.group({
      // formato HH:MM
      horario: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]]
    });
  }

  ngOnInit(): void {
    this.restaurantes = this.storage.getRestaurantes();
    this.setupDropdownListeners();
  }

  setupDropdownListeners(): void {
    this.formSeleccion.get('idRestaurante')?.valueChanges.subscribe(idRestaurante => {
      const todasLasZonas = this.storage.getZonas();
      this.zonasDelRestaurante = todasLasZonas.filter(
        z => z.idRestaurante === idRestaurante
      );
      this.formSeleccion.get('idZona')?.reset(undefined, { emitEvent: false });
      this.horariosDeLaZona = [];
      this.idZonaSeleccionada = null;
    });

    this.formSeleccion.get('idZona')?.valueChanges.subscribe(idZona => {
      this.cargarHorarios(idZona);
    });
  }

  cargarHorarios(idZona: string | null): void {
    if (!idZona) {
      this.horariosDeLaZona = [];
      this.idZonaSeleccionada = null;
      return;
    }
    
    this.idZonaSeleccionada = idZona;
    const todasLasZonas = this.storage.getZonas();
    const zona = todasLasZonas.find(z => z.id === idZona);
    this.horariosDeLaZona = [...(zona?.horariosDisponibles || [])];
    this.horariosDeLaZona.sort();
  }

  agregarHorario(): void {
    if (this.formAgregarHorario.invalid || !this.idZonaSeleccionada) {
      return;
    }

    const nuevoHorario = this.formAgregarHorario.value.horario;

    if (this.horariosDeLaZona.includes(nuevoHorario)) {
      alert('Error: Ese horario ya está agregado.');
      return;
    }

    this.horariosDeLaZona.push(nuevoHorario);
    this.horariosDeLaZona.sort(); 
    this.storage.updateHorariosZona(this.idZonaSeleccionada, this.horariosDeLaZona);
    this.formAgregarHorario.reset();
  }


  borrarHorario(horario: string): void {
    if (!this.idZonaSeleccionada) {
      return;
    }

    this.horariosDeLaZona = this.horariosDeLaZona.filter(h => h !== horario);
    this.storage.updateHorariosZona(this.idZonaSeleccionada, this.horariosDeLaZona);
  }

  get zonaSeleccionada(): boolean {
    return !!this.idZonaSeleccionada;
  }
}