import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotaoComponent } from './botao/botao.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BotaoComponent
  ]
})
export class SharedModule { }
