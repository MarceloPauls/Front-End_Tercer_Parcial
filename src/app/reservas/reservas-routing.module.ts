import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrearReserva } from './crear-reserva/crear-reserva';
import { ListarReservas } from './listar-reservas/listar-reservas';

const routes: Routes = [
  { path: 'crear', component: CrearReserva },
  
  { path: 'listar', component: ListarReservas },
  
  { path: '', redirectTo: 'crear', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class ReservasRoutingModule { }