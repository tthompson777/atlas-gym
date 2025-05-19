import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinanceiroService } from '../../../services/financeiro.service';
import { Transacao } from '../../../models/transacao.model';

@Component({
  selector: 'app-financeiro-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class FinanceiroListaComponent {
  private service = inject(FinanceiroService);
  transacoes: Transacao[] = [];

  constructor() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe({
      next: (res) => this.transacoes = res,
      error: (err) => console.error('Erro ao carregar transações', err)
    });
  }

  excluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;

    this.service.excluir(id).subscribe({
      next: () => this.transacoes = this.transacoes.filter(t => t.id !== id),
      error: (err) => alert('Erro ao excluir: ' + err?.error?.mensagem || err.message)
    });
  }
}
