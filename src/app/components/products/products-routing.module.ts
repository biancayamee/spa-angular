import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormsComponent } from './product-forms/product-forms.component';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'forms', component: ProductFormsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
