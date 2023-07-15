import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FilterService } from 'primeng/api';
import { Client, Clientes} from 'src/app/Models';
import { ClientesService } from 'src/app/Services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [MessageService]
})
export class ClientesComponent {

  clientes: Clientes | undefined;
  items: MenuItem[] | undefined;
  visible: boolean = false;
  searchItem: string | undefined
  name: string | undefined
  loading: boolean = true

  constructor (
    private client_service: ClientesService,
    private messageService: MessageService,
    private filterService: FilterService
  ) { }

  ngOnInit(){
    this.getClients();
  }

  getClients(){
    let items_aux: MenuItem[] = [];
    this.loading = true;
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
                routerLink: '/clients/registerPayment/'+cliente.id
              },
              {
                label: 'Registrar compra',
                icon: 'pi pi-cart-plus',
                routerLink: '/clients/registerProduct/'+cliente.id
              }
            ]
          };
          items_aux.push(item);
        });
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        this.items = items_aux;
      }
    );    
  }

  showDialog() {
    this.visible = !this.visible;
    this.name = ""
  }  
  
  showError(title: string, detail: string) {
    this.messageService.add({severity: 'error', summary: title, detail: detail });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Cliente registrado correctamente' });
  }


  saveClient(){
    if(!this.name){
      this.showError('Campos vacíos', 'Debes llenar el formulario')
    } else {
      let cliente: Client = {
        id: 0,
        name: this.name
      };

      this.client_service.saveClient(cliente).subscribe(
        (data) => {
          this.showSuccess();
          this.showDialog();
          setTimeout(()=> {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.showError('Error', 'Ese nombre ya está registrado');
        }
      )
    }
  }

  filterSearch(){
    let items_aux: MenuItem[] = []
    let flag = false;
    this.loading = true;
    this.clientes?.clientes.forEach(
      cliente => {
        if(this.filterService.filters['contains'](this.searchItem, cliente.name)){
          const item = {
            label: cliente.name,
            items: [
              {
                label: 'Registrar abono',
                icon: 'pi pi-dollar',
                routerLink: '/clients/registerPayment/'+cliente.id
              },
              {
                label: 'Registrar compra',
                icon: 'pi pi-cart-plus',
                routerLink: '/clients/registerProduct/'+cliente.id
              }
            ]
          };
          items_aux.push(item)
          flag = true
        } 
      }
    )

    if(flag){
      this.items = items_aux;
    } else {
      this.items = [];
    }

    if(this.searchItem == ''){
      this.getClients();
    }

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
