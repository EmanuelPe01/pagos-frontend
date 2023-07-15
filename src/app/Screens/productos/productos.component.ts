import { Component } from '@angular/core';
import { Products } from 'src/app/Models';
import { ProductosService } from 'src/app/Services/productos/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {

  productos: Products | undefined

  constructor(
    private productService: ProductosService
  ){ }

  ngOnInit(){
    this.productService.getAll().subscribe(
      (data: Products) => {
        this.productos = data;
        this.productos.productos.forEach( producto => {
            console.log(producto)
          })
      }
    )
  }
}
