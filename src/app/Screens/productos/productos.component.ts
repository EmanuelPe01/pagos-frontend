import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product, Products } from 'src/app/Models';
import { FilterService } from 'primeng/api';
import { ProductosService } from 'src/app/Services/productos/productos.service';
import { Conditional } from '@angular/compiler';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [MessageService]
})
export class ProductosComponent {

  productos: Products | undefined
  items: MenuItem[] = []
  loading: boolean = true
  searchItem: string | undefined
  visible: boolean = false
  confirmDelete: boolean = false
  idProduct: number = 0

  name: string | undefined
  price: number | undefined

  constructor(
    private productService: ProductosService,
    private filterService: FilterService,
    private messageService: MessageService
  ){ }

  ngOnInit(){
    this.getAllProducts();
  }

  getAllProducts(){
    this.loading = true;
    let items_aux: MenuItem[] = []
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
                  icon: 'pi pi-times',
                  command: () => {
                    this.showDelete(producto.id);
                  }
                }
              ]
            }
            items_aux.push(item);
          });
          this.items = items_aux;
          setTimeout(() => {
            this.loading=false;
          }, 500);
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
              icon: 'pi pi-times',
              command: () => {
                this.showDelete(producto.id);
              }
            }
          ]
        }
        items_aux.push(item)
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
      }, 500);
    } 
  }

  showDialog() {
    this.visible = !this.visible;
    this.name = ''
    this.price = undefined
  }

  showDelete(idProduct: number) {
    this.confirmDelete = !this.confirmDelete
    this.idProduct = idProduct
  }

  showError(title: string, detail: string) {
    this.messageService.add({severity: 'error', summary: title, detail: detail });
  }

  showSuccess(title: string, detail: string) {
    this.messageService.add({severity: 'success', summary: title, detail: detail});
  }

  saveProduct() {
    if(!this.name || !this.price){
      this.showError('Campos vacíos', 'Debes llenar todos los campos')
    } else {
      const producto: Product = {
        id: 0,
        name: this.name,
        price: Math.round(this.price),
        created_at: ''
      }

      this.productService.saveProduct(producto).subscribe(
        (data) => {
          this.showSuccess('Registro exitoso', 'Producto registrado correctamente')
          this.showDialog();
          setTimeout(()=> {
            this.getAllProducts();
          }, 500);
        },
        (error) => {
          this.showError('Producto inválido', 'El producto ya esta registrado');
        }
      )
    }
  }

  deleteProduct() {
    this.productService.deleteProduct(this.idProduct).subscribe(
      () => {
        this.showSuccess('Eliminación completa', 'Producto eliminado correctamente')
        this.showDelete(0);
        setTimeout(()=> {
          this.getAllProducts();
        }, 500);
      },
      (error) => {
        console.log(error);
        this.showError('Error', 'Error al eliminar artículo');
      }
    )
  }
}
