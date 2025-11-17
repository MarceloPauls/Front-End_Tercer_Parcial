import { Routes } from '@angular/router';


export const routes: Routes = [

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  
  {
    path: 'reservas',
    loadChildren: () => import('./reservas/reservas.module').then(m => m.ReservasModule)
  },
  
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  
  { path: '**', redirectTo: 'reservas' }
];
