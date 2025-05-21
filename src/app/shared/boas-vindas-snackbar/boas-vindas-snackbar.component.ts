import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boas-vindas-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boas-vindas-snackbar.component.html',
  styleUrls: ['./boas-vindas-snackbar.component.scss'],
})
export class BoasVindasSnackbarComponent implements OnInit {
  segundosRestantes: number | null = null;
  nome = ''; 
  foto?: string;
  mensagem = ''

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.data = data;
  }

  ngOnInit(): void {
    if (this.data.segundosRestantes) {
      this.segundosRestantes = this.data.segundosRestantes;
      this.atualizarContador();
    } else {
      this.mensagem = this.data.mensagem;
    }
  }

  atualizarContador() {
    const interval = setInterval(() => {
      if (this.segundosRestantes! > 1) {
        this.segundosRestantes!--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}
