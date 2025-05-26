import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceiroService } from '../../../services/financeiro.service';
import { Transacao } from '../../../models/transacao.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlunosService, Aluno } from '../../../services/alunos.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../services/toast.service';
import { LoadingComponent } from "../../../shared/loading/loading.component";

@Component({
  selector: 'app-financeiro-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    LoadingComponent
],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class FinanceiroEditarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(FinanceiroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alunosService = inject(AlunosService);

  alunos: Aluno[] = [];
  categoriasQueRequeremAluno = ['Mensalidade', 'Matrícula', 'Avaliação Física'];
  form: FormGroup;
  transacaoId!: number;
  isLoading = false;

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

  constructor(private toast: ToastService,) {
    this.form = this.fb.group({
      tipo: ['', Validators.required],
      categoria: ['', Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      descricao: [''],
      alunoId: [''],
    });

    this.alunosService.listar().subscribe(alunos => this.alunos = alunos);
  }

  ngOnInit(): void {
    this.transacaoId = Number(this.route.snapshot.paramMap.get('id'));

    this.alunosService.listar().subscribe(alunos => {
    this.alunos = alunos;
    this.carregarTransacao();
  });
  }

  get exibirAluno(): boolean {
  const tipo = this.form.get('tipo')?.value;
  const categoria = this.form.get('categoria')?.value;
  return tipo === 'Entrada' && this.categoriasQueRequeremAluno.includes(categoria);
}

  get categorias(): string[] {
    return this.form.get('tipo')?.value === 'Entrada'
      ? this.categoriasEntrada
      : this.categoriasSaida;
  }

  carregarTransacao() {
    this.service.obter(this.transacaoId).subscribe({
      next: (transacao) => this.form.patchValue(transacao),
      error: () => this.toast.show('Erro ao carregar lançamento!', 'erro')
    });
  }

  salvar(): void {
    this.isLoading = true;
    if (this.form.invalid) return;

    const dadosAtualizados: Transacao = this.form.value;

    this.service.atualizar(this.transacaoId, dadosAtualizados).subscribe({
      next: () => {
        this.isLoading = false;
        this.voltar();
      },
      error: (err) => this.toast.show(`${err?.error?.mensagem || err.message}`, 'erro')
    });
  }

  voltar() {
  this.router.navigate(['/financeiro']);
}
}
