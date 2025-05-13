import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-botao',
  standalone: true,
  imports: [
  MatButtonModule, 
  MatIconModule, 
  RouterModule, 
  NgIf,
  NgClass,],
  templateUrl: './botao.component.html',
  styleUrl: './botao.component.scss'
})
export class BotaoComponent {
  @Input() texto: string = '';
  @Input() disableClick: boolean = false;
  @Input() tamanho: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() icone?: string;
  @Input() classe: string = '';
  @Output() clicou = new EventEmitter<void>();
}
