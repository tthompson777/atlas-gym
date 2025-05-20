import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-content" [ngClass]="data.tipo">
      <mat-icon class="toast-icon">{{ icone }}</mat-icon>
      <span class="toast-text">{{ data.mensagem }}</span>
    </div>
  `,
  styleUrls: ['./toast.component.scss'],
  imports: [CommonModule, MatIconModule],
})
export class ToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { mensagem: string; tipo: 'sucesso' | 'erro' | 'info' | 'aviso' }) {}

  get icone() {
    switch (this.data.tipo) {
      case 'sucesso': return 'check_circle';
      case 'erro': return 'error';
      case 'info': return 'info';
      case 'aviso': return 'warning';
      default: return 'notifications';
    }
  }
}
