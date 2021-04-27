import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { ClientsService } from 'src/app/services/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],

})
export class ClientsComponent implements OnInit {
  clientsList: Client[] = [];

  constructor(
    private router: Router,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getClientsList();
  }

  async refreshClientsList(event: any) {
    await this.getClientsList();
    event.target.complete();
  }

  async getClientsList() {
    this.clientsService.getClients()
      .toPromise()
      .then((res: Client[]) => this.clientsList = res);
  }

  deleteClient(id: string) {
    this.clientsService.deleteClientById(id)
      .toPromise()
      .then(
        (res) => {
          this.getClientsList();
          this.showSnackBar('Cliente deletado com suceso.');
        },
        (err) => this.showSnackBar(err.message));
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  editClient(client: Client) {
    this.router.navigate(['home/clients', 'forms', { registeredClientId: client.id }],);
  }
}
