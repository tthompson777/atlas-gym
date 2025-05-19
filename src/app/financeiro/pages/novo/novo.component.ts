import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceiroService } from '../../../services/financeiro.service';
import { Transacao } from '../../../models/transacao.model';
import { Aluno, AlunosService } from '../../../services/alunos.service';

@Component({
  selector: 'app-financeiro-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss']
})
export class FinanceiroNovoComponent {
  private fb = inject(FormBuilder);
  private service = inject(FinanceiroService);
  private router = inject(Router);
  private alunosService = inject(AlunosService);
  alunos: Aluno[] = [];
  categoriasQueRequeremAluno = ['Mensalidade', 'Matrícula', 'Avaliação Física'];

  form: FormGroup;

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
    tipo: ['entrada', Validators.required],
    categoria: ['', Validators.required],
    valor: [null, [Validators.required, Validators.min(0.01)]],
    descricao: [''],
    alunoId: [null]
  });

  this.alunosService.listar().subscribe(alunos => this.alunos = alunos);
  }

  get categorias(): string[] {
    return this.form.get('tipo')?.value === 'entrada'
      ? this.categoriasEntrada
      : this.categoriasSaida;
  }

  get exibirAluno(): boolean {
  const tipo = this.form.get('tipo')?.value;
  const categoria = this.form.get('categoria')?.value;
  return tipo === 'entrada' && this.categoriasQueRequeremAluno.includes(categoria);
}

  salvar(): void {
    if (this.form.invalid) return;

    const transacao: Transacao = this.form.value;

    this.service.criar(transacao).subscribe({
      next: () => this.router.navigate(['/financeiro']),
      error: (err) => alert('Erro ao salvar: ' + (err?.error?.mensagem || err.message))
    });
  }
}
