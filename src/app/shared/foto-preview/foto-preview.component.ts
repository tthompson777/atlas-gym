import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-foto-preview',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatTooltip],
  templateUrl: './foto-preview.component.html',
  styleUrls: ['./foto-preview.component.scss'],
})
export class FotoPreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { foto: string }, private dialogRef: MatDialogRef<FotoPreviewComponent>) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
