import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  styleUrls: ['./admin-layout.component.scss'],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {}
