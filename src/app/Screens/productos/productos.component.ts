import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product, Products } from 'src/app/Models';
import { FilterService } from 'primeng/api';
import { ProductosService } from 'src/app/Services/productos/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [MessageService]
})
export class ProductosComponent {

  productos: Products | undefined
  items: MenuItem[] | undefined
  loading: boolean = true
  searchItem: string | undefined
  visible: boolean = false

  name: string | undefined
  price: number | undefined

  constructor(
    private productService: ProductosService,
    private filterService: FilterService,
    private messageService: MessageService
  ){ }

  ngOnInit(){
    this.getAllProducts()
  }

  getAllProducts(){
    let items_aux: MenuItem [] = []
    this.loading = true;
    this.productService.getAll().subscribe(
      (data: Products) => {
        this.productos = data;
        this.productos.productos.forEach( producto => {
            const item = {
              label: producto.name,
              items: [
                {
                  label: producto.price.toString(),
                  icon: 'pi pi-dollar'
                }, 
                {
                  label: 'Eliminar',
                  icon: 'pi pi-times'
                }
              ]
            }
            items_aux.push(item);
          });
          setTimeout(() => {
            this.loading=false;
          }, 1000);
          this.items = items_aux;
      });
  }

  filterSearch() {
    let items_aux: MenuItem[] = []
    let flag: boolean = false
    this.loading = true;

    this.productos?.productos.forEach(producto => {
      if(this.filterService.filters['contains'](this.searchItem, producto.name)){
        const item = {
          label: producto.name,
          items: [
            {
              label: producto.price.toString(),
              icon: 'pi pi-dollar'
            }, 
            {
              label: 'Eliminar',
              icon: 'pi pi-times'
            }
          ]
        }
        items_aux.push(item);
        flag = true;
      }
    })

    if(this.searchItem == '')   
      this.getAllProducts()
    else {
      if(flag) 
        this.items = items_aux;
      else 
        this.items = [] 

      setTimeout(() => {
        this.loading = false;
      }, 1000);
    } 
  }

  showDialog() {
    this.visible = !this.visible;
    this.name = ''
    this.price = undefined
  }

  showError(title: string, detail: string) {
    this.messageService.add({severity: 'error', summary: title, detail: detail });
  }

  showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Registro exitoso', detail: 'Producto registrado correctamente' });
  }

  saveProduct() {
    if(!this.name || !this.price){
      this.showError('Campos vacíos', 'Debes llenar todos los campos')
    } else {
      const producto: Product = {
        id: 0,
        name: this.name,
        price: Math.round(this.price)
      }

      this.productService.saveProduct(producto).subscribe(
        (data) => {
          this.showSuccess()
          this.showDialog();
          setTimeout(()=> {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.showError('Producto inválido', 'El producto ya esta registrado');
        }
      )
    }
  }
}
