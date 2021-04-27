import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { ClientsComponent } from '../clients/clients.component';
import { ProductsComponent } from '../products/products.component';


@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
  ]
})
export class HomeModule { }
