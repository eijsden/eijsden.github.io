import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AstroidsEvolvedComponent } from './astroids-evolved.component';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material';


const routes: Routes = [
  {
    path: 'astroids',
    component: AstroidsEvolvedComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatProgressSpinnerModule
  ],
  declarations: [AstroidsEvolvedComponent],
  exports: []
})
export class AstroidsEvolvedModule { }
