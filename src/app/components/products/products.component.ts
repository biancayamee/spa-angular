import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  productsList: Product[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getProductsList();
  }

  async refreshProductsList(event: any) {
    await this.getProductsList();
    event.target.complete();
  }

  async getProductsList() {
    this.productsService.getProducts()
      .toPromise()
      .then((res: Product[]) => this.productsList = res);
  }

  deleteProduct(id: string) {
    this.productsService.deleteProductById(id)
      .toPromise()
      .then(
        (res) => {
          this.getProductsList();
          this.showSnackBar('Produto deletado com suceso.');
        },
        (err) => this.showSnackBar(err.message));
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  editProduct(product: Product) {
    this.router.navigate(['home/products', 'forms', { registeredProductId: product.id }],);
  }
}
