import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Aluno, AlunosService } from '../services/alunos.service';
import { calcularIdade } from '../utils';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Exercicio, FichaExercicio, FichaExercicioService } from '../services/ficha-exercicio.service';

@Component({
  selector: 'app-ficha-exercicios',
  standalone: true,
  imports: [
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    // NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './ficha-exercicios.component.html',
  styleUrl: './ficha-exercicios.component.scss'
})
export class FichaExerciciosComponent {

  constructor(private fb: FormBuilder, private alunosService: AlunosService, private fichaService: FichaExercicioService, private router: Router) { }

  alunos: Aluno[] = [];
  alunoSelecionado?: { nome: string, idade: number };
  formFicha: FormGroup = new FormGroup({});

  grupos = [
  {
    nome: 'Peitoral',
    exercicios: ['Supino reto', 'Supino inclinado', 'Supino declinado', 'Crucifixo reto', 'Cross-over']
  },
  {
    nome: 'Costas',
    exercicios: ['Puxada frontal (pulley)', 'Remada baixa', 'Remada unilateral', 'Barra fixa', 'Levantamento terra']
  },
  {
    nome: 'Ombros',
    exercicios: ['Desenvolvimento com halteres', 'Elevação lateral', 'Elevação frontal', 'Remada alta', 'Desenvolvimento Arnold']
  },
  {
    nome: 'Bíceps',
    exercicios: ['Rosca direta', 'Rosca alternada', 'Rosca martelo', 'Rosca concentrada', 'Rosca Scott']
  },
  {
    nome: 'Tríceps',
    exercicios: ['Tríceps pulley', 'Tríceps francês', 'Mergulho no banco', 'Tríceps coice', 'Tríceps testa']
  },
  {
    nome: 'Pernas',
    exercicios: ['Agachamento livre', 'Leg press', 'Cadeira extensora', 'Cadeira flexora', 'Stiff', 'Afundo (passada)']
  },
  {
    nome: 'Glúteos',
    exercicios: ['Agachamento sumô', 'Elevação pélvica', 'Glúteo no cabo', 'Agachamento búlgaro']
  },
  {
    nome: 'Panturrilhas',
    exercicios: ['Elevação de panturrilha em pé', 'Elevação de panturrilha sentado', 'Panturrilha no leg press']
  },
  {
    nome: 'Abdômen',
    exercicios: ['Abdominal reto', 'Abdominal infra', 'Abdominal oblíquo', 'Prancha isométrica', 'Abdominal remador']
  }
];

ngOnInit() {
  const controls: { [key: string]: any } = {
    alunoId: ['', Validators.required]
  };

  for (const grupo of this.grupos) {
    for (const exercicio of grupo.exercicios) {
      controls[this.getControle(grupo.nome, exercicio, 'series')] = ['3'];
      controls[this.getControle(grupo.nome, exercicio, 'repeticoes')] = ['12'];
    }
  }

  this.formFicha = this.fb.group(controls);

  this.alunosService.listar().subscribe({
    next: (res) => this.alunos = res,
    error: (err) => {
      console.error('Erro ao carregar alunos:', err);
      alert('Erro ao buscar alunos!');
    }
  });
}

// Gera nome dos controls
getControle(grupo: string, exercicio: string, tipo: 'series' | 'repeticoes') {
  return `${grupo}_${exercicio}_${tipo}`.replace(/\s+/g, '_').toLowerCase();
}

// Preenche nome e idade do aluno
preencherDadosAluno() {
  const alunoId = this.formFicha.get('alunoId')?.value;
  const aluno = this.alunos.find(a => a.id === alunoId);
  if (aluno) {
    const idade = calcularIdade(aluno.nascimento); // função util
    this.alunoSelecionado = { nome: aluno.nome, idade };
  }
}

salvarFicha() {
  if (this.formFicha.invalid) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const alunoId = this.formFicha.get('alunoId')?.value;

  const exercicios: Exercicio[] = [];

  for (const grupo of this.grupos) {
    for (const nome of grupo.exercicios) {
      const seriesCtrl = this.getControle(grupo.nome, nome, 'series');
      const repeticoesCtrl = this.getControle(grupo.nome, nome, 'repeticoes');

      const series = this.formFicha.get(seriesCtrl)?.value;
      const repeticoes = this.formFicha.get(repeticoesCtrl)?.value;

      if (series || repeticoes) {
        exercicios.push({
          grupo: grupo.nome,
          nome,
          series: Number(series) || 0,
          repeticoes: Number(repeticoes) || 0
        });
      }
    }
  }

  const ficha: FichaExercicio = {
    alunoId,
    exercicios
  };

  this.fichaService.criar(ficha).subscribe({
    next: () => {
      alert('Ficha salva com sucesso!');
      this.router.navigate(['/fichas']);
    },
    error: (err) => {
      console.error('Erro ao salvar ficha:', err);
      alert('Erro ao salvar ficha.');
    }
  });
}


}
