import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, Products, url } from 'src/app/Models';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {


  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<Products>(url + 'allProducts');
  }

  saveProduct(producto: Product) {
    return this.http.post(url + 'createProduct', producto)
  }
}
