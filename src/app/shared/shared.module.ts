import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotaoComponent } from './botao/botao.component';

@NgModule({
  declarations: [BotaoComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class SharedModule { }
