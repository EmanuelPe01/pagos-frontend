import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FilterService, MenuItem, MessageService } from 'primeng/api';
import { Buy, Buys, Products } from 'src/app/Models';
import { ClientesService } from 'src/app/Services/clientes.service';
import { ProductosService } from 'src/app/Services/productos/productos.service';
import { ComprasService } from 'src/app/Services/compras/compras.service';

interface singleProduct {
  label: string,
  value: number,
  precio: number
}

@Component({
  selector: 'app-buys',
  templateUrl: './buys.component.html',
  styleUrls: ['./buys.component.css'],
  providers: [MessageService, CurrencyPipe]
})
export class BuysComponent {
  compras: Buys | undefined
  items: MenuItem[] = []
  price: number | undefined
  productos: singleProduct[] = []
  selectedProduct: any
 
  visible: boolean = false
  confirmDelete: boolean = false
  confirmEdit: boolean = false
  labelEdit: string = ''
  idProduct: number = 0
  loading: boolean = true
  loadingSearch: boolean = true
  showPrice: boolean = false
  searchItem: string | undefined
  precioSugerido: string | undefined

  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private messageService: MessageService,
    private clientService: ClientesService,
    private buyService: ComprasService,
    private paramRoute: ActivatedRoute,
    private filterService: FilterService,
    private productService: ProductosService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.loading = true;
    this.getBuys();
    this.getAllProducts();
    setTimeout(()=> {
      this.loading = false;
    }, 500);
  }

  getBuys(){
    const id = this.paramRoute.snapshot.paramMap.get('id');
    this.loadingSearch = true;
    let items_aux: MenuItem[] = []
    if(id){
      this.clientService.getBuysWithoutFilter(id).subscribe(
        (data: Buys) => {
          this.compras = data;
          
          this.compras.compras.forEach(compra => {
            const fecha = new Date(compra.created_at);
            const item = {
              label: compra.name,
              items: [
                {
                  label: compra.price.toString(),
                  icon: 'pi pi-dollar',
                }, 
                {
                  label: `${fecha.getDate()} de ${this.nombresMeses[fecha.getMonth()]} de ${fecha.getFullYear()}`,
                  icon: 'pi pi-calendar-plus',
                },
                {
                  label: 'Editar',
                  icon: 'pi pi-pencil',
                  iconStyle: {
                    color: 'blue'
                  },
                  command: () => {
                    this.showEdit(compra.id);
                  }
                },
                {
                  label: 'Eliminar',
                  icon: 'pi pi-times',
                  iconStyle: {
                    color: 'red'
                  },
                  command: () => {
                    this.showDelete(compra.id);
                  }
                }
              ]
            }
            items_aux.push(item);
          })
          this.items = items_aux;
          setTimeout(()=> {
            this.loadingSearch = false;
          }, 500);
        }
      );
    }
  }

  filterSearch() {
    let items_aux: MenuItem[] = []
    let flag: boolean = false
    this.loadingSearch = true;

    this.compras?.compras.forEach(producto => {
      if(this.filterService.filters['contains'](this.searchItem, producto.name)){
        const fecha = new Date(producto.created_at);
        const item = {
          label: producto.name,
          items: [
            {
              label: producto.price.toString(),
              icon: 'pi pi-dollar',
            }, 
            {
              label: `${fecha.getDate()} de ${this.nombresMeses[fecha.getMonth()]} de ${fecha.getFullYear()}`,
              icon: 'pi pi-calendar-plus',
            },
            {
              label: 'Editar',
              icon: 'pi pi-pencil',
              iconStyle: {
                color: 'blue'
              },
              command: () => {
                this.showEdit(producto.id);
              }
            },
            {
              label: 'Eliminar',
              icon: 'pi pi-times',
              iconStyle: {
                color: 'red'
              },
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
      this.getBuys()
    else {
      if(flag) 
        this.items = items_aux;
      else 
        this.items = [] 

      setTimeout(() => {
        this.loadingSearch = false;
      }, 500);
    } 
  }

  getAllProducts(){
    this.productService.getAll().subscribe(
      (data: Products) => {
        data.productos.forEach( producto => {
          const item: singleProduct = {
            label: producto.name,
            value: producto.id,
            precio: producto.price
          }
          this.productos.push(item)
        })
      });
  }

  getPrecio()
  {
    if(this.selectedProduct){
      const id_producto = this.selectedProduct
      const producto = this.productos.find((producto) => producto.value == id_producto)
      if (producto?.precio) {
        const precio = this.currencyPipe.transform(producto.precio, 'USD', 'symbol');
        this.precioSugerido = precio?.toString()
      }
      this.showPrice = true;
    } else {
      this.showPrice = false;
    }
  }

  showDialog() {
    this.visible = !this.visible;
    this.showPrice = false;
    this.selectedProduct = undefined;
    this.price = undefined;
    this.precioSugerido = undefined;
  }

  showDelete(idProduct: number) {
    this.confirmDelete = !this.confirmDelete
    this.idProduct = idProduct;
  }

  showEdit(idProduct: number) {
    this.confirmEdit = !this.confirmEdit;
    this.idProduct = idProduct;
    const producto = this.compras?.compras.find(producto => producto.id == idProduct);
    this.labelEdit = "Editar precio de: " + producto?.name;
    this.price = producto?.price;
  }

  showError(title: string, detail: string) {
    this.messageService.add({severity: 'error', summary: title, detail: detail });
  }

  showSuccess(title: string, detail: string) {
    this.messageService.add({severity: 'success', summary: title, detail: detail});
  }

  saveBuy() {
    if(!this.selectedProduct || !this.price){
      this.showError('Error', 'Debes llenar todos los campos');
    } else {
      const id_cliente = this.paramRoute.snapshot.paramMap.get('id');
      const id_producto = this.selectedProduct
      if(id_cliente && this.price > 0){
        const newBuy: Buy = {
          mount: this.price,
          id_cliente: parseInt(id_cliente),
          id_producto: id_producto,
        }
        this.buyService.saveBuy(newBuy).subscribe(
          (data) => {
            this.showSuccess('¡Listo!', 'Compra registrada correctamente');
            this.getBuys();
            this.showDialog();
          },
          (error) => {
            this.showError('Algo salió mal', 'Error de servidor');
          }
        )
      } else {
        this.showError('Cantidad inválida', 'Debes ingresar una cantidad mayor a 0');
      }
    }
  }

  deleteBuy()
  {
    if(this.idProduct){
      this.buyService.deleteBuy(this.idProduct).subscribe(
        ()=> {
          this.showSuccess('Compra eliminada', 'Compra eliminada correctamente');
          this.getBuys();
          this.showDelete(0);
        },
        (error) => {
          this.showError('Algo salió mal', 'Error de servidor');
        }
      )
    }
  }

  editBuy()
  {
    if (this.price && this.idProduct){
      if(this.price>0){
        const buy: any = {
          mount:          this.price,
        }

        this.buyService.editBuy(this.idProduct, buy).subscribe(
          () => {
            this.showSuccess('¡Listo!', 'Compra registrada correctamente');
            this.getBuys();
            this.showEdit(0);
          },
          (error) => {
            this.showError('Algo salió mal', 'Error de servidor');
          }
        )

      } else {
        this.showError('Cantidad inválida', 'Debes ingresar una cantidad mayor a 0');
      }
    } else {
      this.showError('Error', 'Debes llenar todos los campos');
    }
  }
}
