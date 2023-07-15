import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Clientes} from 'src/app/Models';
import { ClientesService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes: Clientes | undefined
  items: MenuItem[] | undefined

  constructor (
    private client_service: ClientesService
  ) { }

  ngOnInit(){
    let items_aux: MenuItem[] =  []
    this.client_service.getAll().subscribe(
      (data: Clientes) => {
        this.clientes = data;
        this.clientes.clientes.forEach(cliente => {
          const item = {
            label: cliente.name,
            items: [
              {
                label: 'Registrar abono',
                icon: 'pi pi-dollar',
                routerLink: '/registerPayment/'+cliente.id
              },
              {
                label: 'Registrar compra',
                icon: 'pi pi-cart-plus',
                routerLink: '/registerProduct/'+cliente.id
              }
            ]
          };
          items_aux.push(item)
        });
        this.items = items_aux;
      }
    );    
  }
}
