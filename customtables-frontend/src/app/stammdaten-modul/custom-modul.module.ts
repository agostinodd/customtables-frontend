import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomModulRoutingModule } from './custom-modul-routing.module';
import { AddCustomtableComponent } from './add-customtable/add-customtable.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import { GeneratedTableComponent } from './generated-table/generated-table.component';
import { GraphComponent } from './graph/graph.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';


@NgModule({
  declarations: [AddCustomtableComponent, GeneratedTableComponent, GraphComponent, CalculatorComponent, NavHeaderComponent],
  exports: [
    NavHeaderComponent
  ],
  imports: [
    CommonModule,
    CustomModulRoutingModule,
    ReactiveFormsModule,
    ClarityModule
  ]
})
export class CustomModulModule { }
