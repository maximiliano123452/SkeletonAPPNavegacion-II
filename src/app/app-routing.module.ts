import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  
  // 👈 RUTAS ESPECÍFICAS PARA MÉDICOS
  {
    path: 'medico',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'medico' },
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('./pages/medico/perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      }
    ]
  },
  
  // 👈 RUTAS ESPECÍFICAS PARA PACIENTES
  {
    path: 'paciente',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'paciente' },
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('./pages/paciente/perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      }
    ]
  },
  
  // 👈 RUTAS ESPECÍFICAS PARA ADMINISTRADORES
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'administrador' },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/paciente/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'bienestar',
    loadChildren: () => import('./pages/shared/bienestar/bienestar.module').then( m => m.BienestarPageModule)
  },
  {
    path: 'farmacias',
    loadChildren: () => import('./pages/shared/farmacias/farmacias.module').then( m => m.FarmaciasPageModule)
  },
  {
    path: 'citas',
    loadChildren: () => import('./pages/shared/citas/citas.module').then( m => m.CitasPageModule)
  },
  {
    path: 'historial-medico',
    loadChildren: () => import('./pages/shared/historial-medico/historial-medico.module').then( m => m.HistorialMedicoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


