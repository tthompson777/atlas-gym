import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceiroService } from '../../../services/financeiro.service';
import { Transacao } from '../../../models/transacao.model';

@Component({
  selector: 'app-financeiro-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class FinanceiroEditarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(FinanceiroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form: FormGroup;
  transacaoId!: number;

  categoriasEntrada: string[] = [
    'Mensalidade', 'Matrícula', 'Avaliação Física',
    'Venda de Produtos', 'Estacionamento', 'Outras Receitas'
  ];

  categoriasSaida: string[] = [
    'Água', 'Luz', 'Telefone/Internet', 'Salários', 'Aluguel',
    'Manutenção de Equipamentos', 'Marketing/Publicidade',
    'Material de Limpeza', 'Material de Escritório', 'Impostos',
    'Contas de Software/Sistemas', 'Equipamentos Novos', 'Uniformes',
    'Cursos/Treinamentos', 'Combustível', 'Material de Primeiros Socorros',
    'Outras Despesas'
  ];

  constructor() {
    this.form = this.fb.group({
      tipo: ['', Validators.required],
      categoria: ['', Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      descricao: ['']
    });
  }

  ngOnInit(): void {
    this.transacaoId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarTransacao();
  }

  get categorias(): string[] {
    return this.form.get('tipo')?.value === 'entrada'
      ? this.categoriasEntrada
      : this.categoriasSaida;
  }

  carregarTransacao() {
    this.service.obter(this.transacaoId).subscribe({
      next: (transacao) => this.form.patchValue(transacao),
      error: () => alert('Erro ao carregar lançamento')
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const dadosAtualizados: Transacao = this.form.value;

    this.service.atualizar(this.transacaoId, dadosAtualizados).subscribe({
      next: () => this.router.navigate(['/financeiro']),
      error: (err) => alert('Erro ao atualizar: ' + (err?.error?.mensagem || err.message))
    });
  }
}
