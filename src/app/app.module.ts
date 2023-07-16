import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBarComponent } from './Components/app-bar/app-bar.component';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ClientesComponent } from './Screens/clientes/clientes.component';
import { PagosComponent } from './Screens/pagos/pagos.component';
import { MainComponent } from './Screens/main/main.component';
import { GalleriaModule } from 'primeng/galleria';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MainClientesComponent } from './Screens/main-clientes/main-clientes.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductosComponent } from './Screens/productos/productos.component';


@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    PagosComponent,
    AppBarComponent,
    MainComponent,
    MainClientesComponent,
    ProductosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToolbarModule,
    ButtonModule,
    SidebarModule,
    MenuModule,
    GalleriaModule,
    PanelMenuModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ProgressSpinnerModule,
    InputNumberModule,
    DividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
