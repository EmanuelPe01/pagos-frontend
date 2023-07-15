import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  images: any[] = [
    {
      src: "../../../assets/img/1.jpg",
      mini: "../../../assets/img/1_1.jpg",
      alt: 'Un precio',
      title: 'Producto 1'
    },
    {
      src: "../../../assets/img/2.jpg",
      mini: "../../../assets/img/2_1.jpg",
      alt: 'Un precio',
      title: 'Producto 2'
    },
    {
      src: "../../../assets/img/3.jpg",
      mini: "../../../assets/img/3_1.jpg",
      alt: 'Un precio',
      title: 'Producto 3'
    },
    {
      src: "../../../assets/img/4.jpg",
      mini: "../../../assets/img/4_1.jpg",
      alt: 'Un precio',
      title: 'Producto 4'
    },
  ]

  responsiveOptions: any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];


}
