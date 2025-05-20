import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../shared/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(mensagem: string, tipo: 'sucesso' | 'erro' | 'info' | 'aviso' = 'info', duracao: number = 4000) {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { mensagem, tipo },
      duration: duracao,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snack-toastr']
    });
  }
}
