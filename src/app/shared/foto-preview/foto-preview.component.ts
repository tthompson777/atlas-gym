import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foto-preview',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `<img [src]="data.foto" alt="Foto ampliada" style="max-width: 100%; border-radius: 8px;" />`,
})
export class FotoPreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { foto: string }) {}
}
