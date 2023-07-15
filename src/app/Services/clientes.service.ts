import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, Clientes, url } from '../Models';
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
}
