import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boas-vindas-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boas-vindas-snackbar.component.html',
  styleUrls: ['./boas-vindas-snackbar.component.scss'],
})
export class BoasVindasSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { nome: string, foto?: string, mensagem: string }) {}
}
