import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminRestaurantes } from './admin-restaurantes/admin-restaurantes';
import { AdminZonas } from './admin-zonas/admin-zonas';
import { AdminMesas } from './admin-mesas/admin-mesas';
import { AdminHorarios } from './admin-horarios/admin-horarios';

const routes: Routes = [
  { path: 'restaurantes', component: AdminRestaurantes },
  
  { path: 'zonas', component: AdminZonas },
  
  { path: 'mesas', component: AdminMesas },
  
  { path: 'horarios', component: AdminHorarios },
  
  { path: '', redirectTo: 'restaurantes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class AdminRoutingModule { }