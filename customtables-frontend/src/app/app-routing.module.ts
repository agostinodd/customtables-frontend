import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BaseDataGuard} from './Guards/base-data.guard';
import {LoginComponent} from './login/login.component';


const routes: Routes = [
  {path: 'data', loadChildren: () => import('./stammdaten-modul/custom-modul.module').then(mod => mod.CustomModulModule)},
  {path: '**', redirectTo: 'data'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
