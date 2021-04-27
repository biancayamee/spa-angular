import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-client-forms',
  templateUrl: './client-forms.component.html',
  styleUrls: ['./client-forms.component.scss']
})
export class ClientFormsComponent implements OnInit {

  public creatingNewClient!: boolean;
  public registerForm!: FormGroup;
  private client: Client = new Client;
  private registeredClientId!: string;
  public isLoadingForm: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    private clientsService: ClientsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getCliendIdParam();
    this.setFormValues();
  }

  getCliendIdParam() {
    const clientIdParam = this.route.snapshot.paramMap.get('registeredClientId');
    if (clientIdParam !== null) {
      this.registeredClientId = clientIdParam;
    }
  }

  async setFormValues() {
    this.creatingNewClient = this.registeredClientId == null;
    if (!this.creatingNewClient) {
      await this.clientsService.getClientById(this.registeredClientId)
        .toPromise()
        .then((res: Client) => {
          this.client.name = res.name;
          this.client.cpf = res.cpf;
          this.client.email = res.email;
          this.client.gender = res.gender;
        });
    }
    this.initForm();
  }

  onSubmit() {
    if (this.creatingNewClient) {
      this.saveNewClient();
    } else {
      this.updateRegisteredClient();
    }
  }

  saveNewClient() {
    this.clientsService.saveClient(this.registerForm.value.name, this.registerForm.value.cpf, this.registerForm.value.email, this.registerForm.value.gender)
      .toPromise()
      .then((res: any) => {
        this.showSnackBar(res.message);
        this.registerForm.reset();
      },
        () => this.showSnackBar('Ocorreu um erro ao cadastrar o cliente, tente novamente mais tarde.'));
  }

  updateRegisteredClient() {
    this.clientsService.updateClientById(this.registeredClientId, this.registerForm.value.name, this.registerForm.value.cpf, this.registerForm.value.email, this.registerForm.value.gender)
      .toPromise()
      .then((res: any) => {
        this.showSnackBar(res.message);
      },
        () => this.showSnackBar('Ocorreu um erro ao atualizar o cliente, tente novamente mais tarde.'));
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  initForm() {
    this.registerForm = new FormGroup({
      name: new FormControl(this.client.name, [Validators.required]),
      email: new FormControl(this.client.email, Validators.compose([
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]{2,3})+$/
        )
      ])),
      cpf: new FormControl(this.client.cpf, Validators.compose([Validators.required])),
      gender: new FormControl(this.client.gender, Validators.compose([Validators.required])),
    });
    this.isLoadingForm = false;
  }

  get name() { return this.registerForm.get('name') };
  get email() { return this.registerForm.get('email') };
  get cpf() { return this.registerForm.get('cpf') };
  get gender() { return this.registerForm.get('gender') };

}
