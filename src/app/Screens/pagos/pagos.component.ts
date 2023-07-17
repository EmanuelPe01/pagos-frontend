import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Payment, PaymentClient, PaymentRegister, Payments} from 'src/app/Models';
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
  selectedProduct: number | undefined
  mount: number | undefined
  productos: singleProduct[] = []
  pagos: Payment[] = []
  adeudo: number = 0

  noResults: boolean = true
  loading: boolean = true
  loadPayments: boolean = false
  visible: boolean = false
  labelSelectProduct: string | undefined
  selectedPayment: Payment | undefined
  editPayment: boolean = false
  showDue: boolean = false
  showAdd: boolean = true

  constructor(
    private clientService: ClientesService,
    private paymentService: PagosService,
    private paramRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(){
    this.getBuys();
  }

  getBuys(){
    const id = this.paramRoute.snapshot.paramMap.get('id');
    this.loading = true;
    if(id){
      this.clientService.getBuys(id).subscribe(
        (data: PaymentClient) => {
          this.compras = data
          this.compras.compras.forEach( producto => {
            const p: singleProduct = {
              label: producto.name,
              value: producto.id
            };
            this.productos.push(p)
          })
          setTimeout(()=> {
            this.loading = false;
          }, 500);
        }
      );
    }
  }

  getPaymentsByProduct(){
    this.pagos = []
    if(this.selectedProduct){
      const id_product = this.selectedProduct
      let abonos = 0
      this.loadPayments = true;
      this.labelSelectProduct = 'Registrar abono: ' + this.productos[id_product-1].label
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
          (data) => {
            this.showSuccess('Pago registrado', 'Pago registrado exitosamente');
            this.showDialog();
            setTimeout(() => {
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
    if(this.selectedProduct && this.mount && this.mount > 0 && this.selectedPayment){
      this.adeudo += this.mount
      if(this.mount <= this.adeudo ){
        const pago: PaymentRegister = {
          mount: this.mount,
          id_compra: this.selectedProduct
        }
        const id_compra = this.selectedPayment.id;
  
        this.paymentService.editPayment(pago, id_compra).subscribe(
          (data) => {
            this.showSuccess('Pago registrado', 'Pago registrado exitosamente');
            this.showDialog();
            setTimeout(() => {
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

  showDialog(){
    this.visible = !this.visible;
  }

  showError(title: string, detail: string) {
    this.messageService.add({severity: 'error', summary: title, detail: detail });
  }

  showSuccess(title: string, detail: string) {
    this.messageService.add({severity: 'success', summary: title, detail: detail});
  }

  showEditableButton(){
    this.editPayment = true;
    if(this.selectedProduct && this.selectedPayment){
      const id_product = this.selectedProduct
      const id_payment = this.selectedPayment.id
      var pay = this.pagos.find((pago) => {
        return pago.id == id_payment
      })
      this.labelSelectProduct = 'Editar abono: ' + this.productos[id_product-1].label
      this.mount = pay?.mount
    }
  }

  hideEditableButton(){
    this.editPayment = false;
    this.labelSelectProduct = undefined
  }
}
