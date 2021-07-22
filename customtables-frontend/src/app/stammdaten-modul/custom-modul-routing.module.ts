import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddCustomtableComponent} from './add-customtable/add-customtable.component';
import {GeneratedTableComponent} from './generated-table/generated-table.component';
import {GraphComponent} from './graph/graph.component';


const routes: Routes = [
  {path: 'table', component: GeneratedTableComponent},
  {path: 'graphs', component: GraphComponent},
  {path: '**', component: AddCustomtableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomModulRoutingModule { }
