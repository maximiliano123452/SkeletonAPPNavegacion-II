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

  // Rutas de MEDICO
  {
    path: 'medico/perfil',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'medico' },
    loadChildren: () => import('./pages/medico/perfil/perfil.module').then(m => m.PerfilPageModule)
  },

  // Rutas de PACIENTE
  {
    path: 'paciente/perfil',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'paciente' },
    loadChildren: () => import('./pages/paciente/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'paciente/buscar-medicos',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'paciente' },
    loadChildren: () => import('./pages/paciente/buscar-medicos/buscar-medicos.module').then(m => m.BuscarMedicosPageModule)
  },

  // Rutas de ADMINISTRADOR
  {
    path: 'admin/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'administrador' },
    loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'admin/usuarios',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'administrador' },
    loadChildren: () => import('./pages/admin/usuarios/usuarios.module').then(m => m.UsuariosPageModule)
  },

  // Rutas compartidas
  {
    path: 'bienestar',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/shared/bienestar/bienestar.module').then(m => m.BienestarPageModule)
  },
  {
    path: 'farmacias',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/shared/farmacias/farmacias.module').then(m => m.FarmaciasPageModule)
  },
  {
    path: 'citas',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/shared/citas/citas.module').then(m => m.CitasPageModule)
  },
  {
    path: 'historial-medico',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/shared/historial-medico/historial-medico.module').then(m => m.HistorialMedicoPageModule)
  },

  // Página no encontrada
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }




