import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './Screens/clientes/clientes.component';
import { MainComponent } from './Screens/main/main.component';
import { MainClientesComponent } from './Screens/main-clientes/main-clientes.component';
import { ProductosComponent } from './Screens/productos/productos.component';
import { PagosComponent } from './Screens/pagos/pagos.component';
import { BuysComponent } from './Screens/buys/buys.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {
    path: 'clients', 
    component: MainClientesComponent,  
    children: [
      {path: '', component: ClientesComponent},
      {path: 'registerPayment/:id', component: PagosComponent},
      {path: 'registerBuy/:id', component: BuysComponent}
    ]
  },
  {path: 'products', component: ProductosComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
