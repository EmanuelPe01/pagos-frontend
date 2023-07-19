import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, Clientes, PaymentClient, url, Buys } from '../Models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Clientes> {
    return this.http.get<Clientes>(url + 'allClients');
  }

  saveClient(cliente: Client){
    return this.http.post(url + 'createClient', cliente);
  }

  getBuys(id: string){
    return this.http.get<PaymentClient>(url + 'getClient/' + id);
  }

  getBuysWithoutFilter (id: string) {
    return this.http.get<Buys>(url + 'getBuys/'+id);
  }
}
