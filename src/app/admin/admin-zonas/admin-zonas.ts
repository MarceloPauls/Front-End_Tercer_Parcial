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
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin-zonas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './admin-zonas.html',
  styleUrl: './admin-zonas.css'
})
export class AdminZonas implements OnInit {

  formZona: FormGroup;
  restaurantes: Restaurante[] = [];
  
  zonasFiltradas: Zona[] = [];
  private todasLasZonas: Zona[] = [];

  private idRestauranteSeleccionado: string | null = null;

  constructor(
    private storage: StorageService,
    private fb: FormBuilder
  ) {
    this.formZona = this.fb.group({
      idRestaurante: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.restaurantes = this.storage.getRestaurantes();
    this.todasLasZonas = this.storage.getZonas();
  }

  agregarZona(): void {
    if (this.formZona.invalid) {
      return;
    }
    
    const { nombre, idRestaurante } = this.formZona.value;
    const exito = this.storage.addZona(nombre, idRestaurante);

    if (exito) {
      this.formZona.reset();
      this.cargarDatos();
      this.filtrarZonas(idRestaurante);
      
    } else {
      alert('Error: Ya existe una zona con ese nombre en ese restaurante.');
    }
  }

  borrarZona(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta zona? Se borrarán todas sus mesas y reservas.')) {
      this.storage.deleteZona(id);
      this.cargarDatos(); 
      this.filtrarZonas();
    }
  }

  filtrarZonas(idRestaurante?: string): void {
    if (idRestaurante) {
      this.idRestauranteSeleccionado = idRestaurante;
    }
    
    if (!this.idRestauranteSeleccionado) {
      this.zonasFiltradas = [];
      return;
    }

    this.zonasFiltradas = this.todasLasZonas.filter(
      z => z.idRestaurante === this.idRestauranteSeleccionado
    );
  }
}