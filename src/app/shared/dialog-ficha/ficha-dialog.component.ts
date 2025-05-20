import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ficha-dialog',
  standalone: true,
  templateUrl: './ficha-dialog.component.html',
  styleUrl: './ficha-dialog.component.scss',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule]
})
export class FichaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FichaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensagem: string }
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
