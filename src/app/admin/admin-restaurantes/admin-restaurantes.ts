import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { Restaurante } from '../../core/models/restaurante.model';

import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-admin-restaurantes',

  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  
  templateUrl: './admin-restaurantes.html',
  styleUrl: './admin-restaurantes.css'
})
export class AdminRestaurantes implements OnInit {

  restaurantes: Restaurante[] = [];
  formRestaurante: FormGroup;

  constructor(
    private storage: StorageService,
    private fb: FormBuilder
  ) {
    this.formRestaurante = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarRestaurantes();
  }

  cargarRestaurantes(): void {
    this.restaurantes = this.storage.getRestaurantes();
  }

  agregarRestaurante(): void {
    if (this.formRestaurante.valid) {
      const nombre = this.formRestaurante.value.nombre;
      
      const exito = this.storage.addRestaurante(nombre); 

      if (exito) {
        this.formRestaurante.reset();
        this.cargarRestaurantes(); 
      } else {
        alert('Error: Ya existe un restaurante con ese nombre.');
      }
    }
  }


  borrarRestaurante(id: string): void {
    if (confirm('¿Estás seguro de eliminar este restaurante? Se borrarán todas sus zonas, mesas y reservas.')) {
      this.storage.deleteRestaurante(id); 
      this.cargarRestaurantes(); 
    }
  }
}