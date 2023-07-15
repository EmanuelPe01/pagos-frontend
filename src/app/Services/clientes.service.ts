import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Clientes } from '../Models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private http: HttpClient) { }

  url = 'http://127.0.0.1:8000/api/'

  getAll(): Observable<Clientes> {
    return this.http.get<Clientes>(this.url + 'allClients');
  }
}
