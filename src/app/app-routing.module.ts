import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './Components/clientes/clientes.component';
import { MainComponent } from './Components/main/main.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'clients', component: ClientesComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
