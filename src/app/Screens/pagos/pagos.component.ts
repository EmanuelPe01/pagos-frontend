import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { MenuItem, MessageService, SelectItemGroup } from 'primeng/api';
import { Payment, PaymentClient, PaymentRegister, Payments, Product} from 'src/app/Models';
import { ClientesService } from 'src/app/Services/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { PagosService } from 'src/app/Services/pagos/pagos.service';

interface singleProduct {
  label: string,
  value: number
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  providers: [MessageService]
})
export class PagosComponent {
  compras: PaymentClient | undefined
  selectedProduct: any 
  mount: number | undefined
  productos: SelectItemGroup[] = [];
  pagos: Payment[] = []
  adeudo: number = 0
  items: MenuItem[] | undefined
  activeItem: MenuItem | undefined

  noResults: boolean = true
  loading: boolean = true
  loadPayments: boolean = false
  visible: boolean = false
  labelSelectProduct: string | undefined
  selectedPayment: Payment | undefined
  editPayment: boolean = false
  showDue: boolean = false
  showAdd: boolean = true
  filterPayment: number | undefined

  constructor(
    private clientService: ClientesService,
    private paymentService: PagosService,
    private paramRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(){
    this.getBuys(1);
    this.items = [
      {
        label: 'Pendientes',
        icon: 'pi pi-clock',
        command: () => {
          this.getSelectedPayments(1)
        }
      },
      {
        label: 'Pagados',
        icon: 'pi pi-verified',
        command: () => {
          this.getSelectedPayments(2);
        }
      }
    ]
    this.activeItem = this.items[0]
  }

  getBuys(type: number){
    const id = this.paramRoute.snapshot.paramMap.get('id');
    this.loading = true;
    if(id){
      this.clientService.getBuys(id).subscribe(
        (data: PaymentClient) => {
          this.compras = data;
          this.getSelectedPayments(1);
          setTimeout(()=> {
            this.loading = false;
          }, 500);
        }
      );
    }
  }

  getSelectedPayments(tipo: number){
    this.productos = [];
    this.pagos = [];
    this.selectedProduct = undefined
    this.noResults = true
    this.editPayment = false;
    this.showDue = false;
    this.filterPayment = tipo
    if(tipo == 1) {
      const pagados: any = this.compras?.pendientes
      Object.keys(pagados).forEach(grupo => {
          const items: singleProduct[] = []
          pagados[grupo].forEach((producto: any)=> {
            items.push({
              label: producto.name,
              value: producto.id
            })
          })
          const group = {
            label: grupo,
            value: grupo,
            items: items
          }
          this.productos.push(group)
      })
    } else if (tipo == 2) {
      const pagados: any = this.compras?.pagados
      Object.keys(pagados).forEach(grupo => {
          const items: singleProduct[] = []
          pagados[grupo].forEach((producto: Product)=>{
            items.push({
              label: producto.name,
              value: producto.id
            })
          })
          const group = {
            label: grupo,
            value: grupo,
            items: items
          }
          this.productos.push(group)
      })
    }
  }

  getPaymentsByProduct(){
    this.pagos = []
    let producto: any = {
      name:         String,
      id_producto:  Number
    }
    
    if(this.selectedProduct){
      const id_product = this.selectedProduct
      let abonos = 0
      this.loadPayments = true;

      this.productos.find(
        grupo => grupo.items.find(item => {
          if(item.value == id_product){
            producto.id_producto = item.value
            producto.name = item.label
          }
        })
      );

      this.labelSelectProduct = 'Registrar abono: ' + producto.name

      this.paymentService.getPayments(id_product).subscribe(
        (data: Payments) => {
          data.pagos.forEach( pago => {
            pago.created_at = formatDate(pago.created_at, 'dd-MM-yyyy', 'en-US');
            abonos += pago.mount
            this.pagos.push(pago)
          })
          if(this.pagos.length == 0)
            this.noResults = true
          else
            this.noResults = false

          if(abonos > 0)
            this.adeudo = data.mount - abonos;
          else 
            this.adeudo = data.mount;
          
          if (this.adeudo == 0)
            this.showAdd = false
          else 
            this.showAdd = true

          this.showDue = true;
        }
      )
      setTimeout(() => {
        this.loadPayments = false;
      }, 500);
    } else {
      this.noResults = true
      this.editPayment = false;
      this.showDue = false;
    }
  }

  savePayment() {
    if(this.selectedProduct && this.mount && this.mount > 0 && this.adeudo){
      if(this.mount <= this.adeudo){
        const pago: PaymentRegister = {
          mount: this.mount,
          id_compra: this.selectedProduct
        }
  
        this.paymentService.savePayment(pago).subscribe(
          (data: any) => {
            this.showSuccess('Pago registrado', 'Pago registrado exitosamente');
            this.showDialog(true);
            setTimeout(() => {
              if(data.adeudo == 0){
                this.getBuys(2);
                this.activeItem = this.items?.[1];
              }
              else 
                this.getPaymentsByProduct();
            }, 500);
          },
          (error) => {
            this.showError('Error al pagar', 'Error de servidor')
          }
        )
      } else {
        this.showError('Cantidad inválida', 'La cantidad excede el adeudo');
      }
    } else {
      this.showError('Cantidad inválida', 'Debes poner un pago mayor a 0');
    }
  }

  saveEditedPayment() {
    let flag = false;
    if(this.adeudo > 0) flag = true;

    if(this.selectedProduct && this.mount && this.mount > 0 && this.selectedPayment){
      this.adeudo += this.mount
      if(this.mount <= this.adeudo ){
        const pago: PaymentRegister = {
          mount: this.mount,
          id_compra: this.selectedProduct
        }
        const id_compra = this.selectedPayment.id;
  
        this.paymentService.editPayment(pago, id_compra).subscribe(
          (data: any) => {
            this.showSuccess('Pago registrado', 'Pago registrado exitosamente');
            this.showDialog(true);
            setTimeout(() => {
              if(flag && data.adeudo>0)
                this.getPaymentsByProduct();
              else {
                  this.getBuys(1);
                  if(this.items) this.activeItem = this.items[0];
              }
            }, 500);
          },
          (error) => {
            this.showError('Error al pagar', 'Error de servidor')
          }
        )
      } else {
        this.showError('Cantidad inválida', 'La cantidad excede el adeudo');
      }
    } else {
      this.showError('Cantidad inválida', 'Debes poner un pago mayor a 0');
    }
  }

  showDialog(flag: boolean){
    this.visible = !this.visible;
    if(flag) {
      this.editPayment = false;
      this.mount = undefined;
      this.selectedPayment = undefined;
    }
  }

  showError(title: string, detail: string) {
    this.messageService.add({severity: 'error', summary: title, detail: detail });
  }

  showSuccess(title: string, detail: string) {
    this.messageService.add({severity: 'success', summary: title, detail: detail});
  }

  showEditableButton(){
    this.editPayment = true;
    let producto: any = {
      name:         String,
      id_producto:  Number
    }

    if(this.selectedProduct && this.selectedPayment){
      const id_product = this.selectedProduct
      const id_payment = this.selectedPayment.id
      
      this.productos.find(
        grupo => grupo.items.find(item => {
          if(item.value == id_product){
            producto.id_producto = item.value
            producto.name = item.label
          }
        })
      );
      
      var pay = this.pagos.find((pago) => {
        return pago.id == id_payment
      })
      this.labelSelectProduct = 'Registrar abono: ' + producto.name
      this.mount = pay?.mount
    }
  }

  hideEditableButton(){
    this.editPayment = false;
    this.labelSelectProduct = ''
  }
}
