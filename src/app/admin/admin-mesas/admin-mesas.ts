import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { Restaurante } from '../../core/models/restaurante.model';
import { Zona } from '../../core/models/zona.model';
import { Mesa } from '../../core/models/mesa.model';

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
  selector: 'app-admin-mesas',
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
  templateUrl: './admin-mesas.html',
  styleUrl: './admin-mesas.css'
})
export class AdminMesas implements OnInit {

  formSeleccion: FormGroup;
  formAgregarMesa: FormGroup;

  restaurantes: Restaurante[] = [];
  zonasDelRestaurante: Zona[] = [];
  mesasDeLaZona: Mesa[] = [];

  // Caché de datos
  private todasLasZonas: Zona[] = [];
  private todasLasMesas: Mesa[] = [];

  constructor(
    private storage: StorageService,
    private fb: FormBuilder
  ) {

    this.formSeleccion = this.fb.group({
      idRestaurante: [''],
      idZona: ['']
    });
     
    this.formAgregarMesa = this.fb.group({
      numero: [null, [Validators.required, Validators.min(1)]],
      capacidad: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.setupDropdownListeners();
  }

  cargarDatos(): void {
    this.restaurantes = this.storage.getRestaurantes();
    this.todasLasZonas = this.storage.getZonas();
    this.todasLasMesas = this.storage.getMesas();
  }

  setupDropdownListeners(): void {
    this.formSeleccion.get('idRestaurante')?.valueChanges.subscribe(idRestaurante => {
      this.zonasDelRestaurante = this.todasLasZonas.filter(
        z => z.idRestaurante === idRestaurante
      );
      this.formSeleccion.get('idZona')?.reset(undefined, { emitEvent: false });
      this.mesasDeLaZona = [];
    });
 
    this.formSeleccion.get('idZona')?.valueChanges.subscribe(idZona => {
      this.filtrarMesas(idZona);
    });
  }


  filtrarMesas(idZona: string | null): void {
    if (!idZona) {
      this.mesasDeLaZona = [];
      return;
    }
    this.mesasDeLaZona = this.todasLasMesas.filter(
      m => m.idZona === idZona
    );
  }

  agregarMesa(): void {
    if (this.formAgregarMesa.invalid) {
      return;
    }

    const idZonaSeleccionada = this.formSeleccion.value.idZona;
    if (!idZonaSeleccionada) {
      alert('Error: Debe seleccionar una zona primero.');
      return;
    }

    const { numero, capacidad } = this.formAgregarMesa.value;
    const exito = this.storage.addMesa(numero, capacidad, idZonaSeleccionada);

    if (exito) {
      this.formAgregarMesa.reset(); 
      this.todasLasMesas = this.storage.getMesas();
      this.filtrarMesas(idZonaSeleccionada);
    } else {
      alert('Error: Ya existe una mesa con ese número en esta zona.');
    } 
  }

  borrarMesa(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta mesa? Se borrarán todas sus reservas.')) {
      this.storage.deleteMesa(id);
      
      const idZonaSeleccionada = this.formSeleccion.value.idZona;
      this.todasLasMesas = this.storage.getMesas();
      this.filtrarMesas(idZonaSeleccionada); 
    }
  }

  get zonaSeleccionada(): boolean {
    return !!this.formSeleccion.value.idZona;
  }
}