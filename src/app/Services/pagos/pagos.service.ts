import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/app/Models';
import { PaymentRegister, Payments } from 'src/app/Models/PaymentModel';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(
    private http: HttpClient
  ) { }

  getPayments(id: number) {
    return this.http.get<Payments>(url + 'getPaymentsForBuy/' + id.toString());
  }

  savePayment(pay: PaymentRegister){
    return this.http.post(url + 'savePayment', pay);
  }

  editPayment(pay: PaymentRegister, id: number){
    return this.http.put(url +'editPayment/'+ id.toString(), pay);
  }
}
