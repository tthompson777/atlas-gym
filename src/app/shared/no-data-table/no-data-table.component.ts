import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-data-table',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './no-data-table.component.html',
  styleUrl: './no-data-table.component.scss'
})
export class NoDataTableComponent {
  @Input() icon: string = '';

}
