import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BienestarPage } from './bienestar.page';

const routes: Routes = [
  {
    path: '',
    component: BienestarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BienestarPageRoutingModule {}
