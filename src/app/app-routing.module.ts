import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchingComponent } from './searching/searching.component';

const routes: Routes = [
  {
    path: '', 
    component: SearchingComponent, 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
