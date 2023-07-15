import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent {
  @Input() titulo: string | undefined
  items: MenuItem[] | undefined;
  sidebarVisible: boolean = false;

  ngOnInit(){
    this.items = [
      {
        label: "Inicio",
        icon: "pi pi-home",
        routerLink: "/"
      },
      {
        label: "Clientes",
        icon: "pi pi-users",
        routerLink: "/clients"
      },
      {
        label: "Productos",
        icon: "pi pi-inbox",
        routerLink: "/products"
      },
    ]
  }
}
