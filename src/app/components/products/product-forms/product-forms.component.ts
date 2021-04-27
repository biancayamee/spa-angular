import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';
@Component({
  selector: 'app-product-forms',
  templateUrl: './product-forms.component.html',
  styleUrls: ['./product-forms.component.scss']
})
export class ProductFormsComponent implements OnInit {
  public creatingNewProduct!: boolean;
  public registerForm!: FormGroup;
  private product: Product = new Product;
  private registeredProductId!: string;
  public isLoadingForm: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getCliendIdParam();
    this.setFormValues();
  }

  getCliendIdParam() {
    const productIdParam = this.route.snapshot.paramMap.get('registeredProductId');
    if (productIdParam !== null) {
      this.registeredProductId = productIdParam;
    }
  }

  async setFormValues() {
    this.creatingNewProduct = this.registeredProductId == null;
    if (!this.creatingNewProduct) {
      await this.productsService.getProductById(this.registeredProductId)
        .toPromise()
        .then((res: Product) => {
          this.product.name = res.name;
          this.product.manufacturing = res.manufacturing;
          this.product.size = res.size;
          this.product.price = res.price;
        });
    }
    this.initForm();
  }

  onSubmit() {
    if (this.creatingNewProduct) {
      this.saveNewProduct();
    } else {
      this.updateRegisteredProduct();
    }
  }

  saveNewProduct() {
    this.productsService.saveProduct(this.registerForm.value.name, this.registerForm.value.manufacturing, this.registerForm.value.size, this.registerForm.value.price)
      .toPromise()
      .then((res: any) => {
        this.showSnackBar(res.message);
        this.registerForm.reset();
      },
        () => this.showSnackBar('Ocorreu um erro ao cadastrar o produto, tente novamente mais tarde.'));
  }

  updateRegisteredProduct() {
    this.productsService.updateProductById(this.registeredProductId, this.registerForm.value.name, this.registerForm.value.manufacturing, this.registerForm.value.size, this.registerForm.value.price)
      .toPromise()
      .then((res: any) => {
        this.showSnackBar(res.message);
      },
        () => this.showSnackBar('Ocorreu um erro ao atualizar o produto, tente novamente mais tarde.'));
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  initForm() {
    this.registerForm = new FormGroup({
      name: new FormControl(this.product.name, [Validators.required]),
      manufacturing: new FormControl(this.product.manufacturing, Validators.compose([
        Validators.required])),
      size: new FormControl(this.product.size, Validators.compose([Validators.required])),
      price: new FormControl(this.product.price, Validators.compose([Validators.required])),
    });
    this.isLoadingForm = false;
  }

  get name() { return this.registerForm.get('name') };
  get manufacturing() { return this.registerForm.get('manufacturing') };
  get size() { return this.registerForm.get('size') };
  get price() { return this.registerForm.get('price') };


}
