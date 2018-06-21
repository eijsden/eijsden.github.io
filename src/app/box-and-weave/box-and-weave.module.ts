import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoxAndWeaveComponent} from "./box-and-weave.component";
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from "@angular/material";

const routes: Routes = [
  {
    path: 'box-and-weave',
    component: BoxAndWeaveComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatProgressSpinnerModule
  ],
  exports: [],
  declarations: [BoxAndWeaveComponent]
})
export class BoxAndWeaveModule { }
