import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FinanceiroService } from '../../../services/financeiro.service';
import { Transacao } from '../../../models/transacao.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataTableComponent } from "../../../shared/no-data-table/no-data-table.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-financeiro-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTooltipModule, MatIconModule, MatCardModule, MatTableModule, MatTooltipModule, MatPaginator, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, NoDataTableComponent],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class FinanceiroListaComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  transacoes: Transacao[] = [];
  colunas: string[] = ['id', 'tipo', 'categoria', 'valor', 'descricao', 'data', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);
  private service = inject(FinanceiroService);

  constructor(private router: Router, private dialog: MatDialog,) {
    this.carregar();
  }

  novoLancamento() {
  this.router.navigate(['/financeiro/novo']);
}

  editarLancamento(id: number) {
    this.router.navigate(['/financeiro/editar', id]);
  }

  carregar(): void {
    this.service.listar().subscribe(transacoes => {
      this.dataSource.data = transacoes;

      // Garante que o paginator é atribuído após os dados estarem prontos
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  excluir(id: number): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { mensagem: 'Tem certeza que deseja excluir este lançamento?' }
      });
  
      dialogRef.afterClosed().subscribe(confirmado => {
        if (confirmado) {
          this.service.excluir(id).subscribe({
            next: () => {
              this.transacoes = this.transacoes.filter(t => t.id !== id);
              this.carregar();
            },
            error: err => console.error('Erro ao excluir aluno:', err)
          });
        }
      });
    }

    gerarPagamento(id: number): void {
    this.service.gerarPagamento(id).subscribe({
      next: (res) => {
        if (res.paymentLink) {
          window.open(res.paymentLink, '_blank');
        }
      },
      error: (err) => {
        console.error('Erro ao gerar pagamento:', err);
        alert('Erro ao gerar link de pagamento.');
      }
    });
  }
}
