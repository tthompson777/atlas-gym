import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tag-status',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tag-status.component.html',
  styleUrl: './tag-status.component.scss'
})
export class TagStatusComponent implements OnChanges {
  @Input() status: string = '';
  statusColor = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.setStatusColor();
    }
  }

  setStatusColor() {
    if (this.status === 'Pendente') {
      this.statusColor = 'status-pendente';
    } else if (this.status === 'Inativo') {
      this.statusColor = 'status-inativo';
    } else if (this.status === 'Ativo') {
      this.statusColor = 'status-ativo';
    } else {
      this.statusColor = 'status-pendente';
    }
  }
}
