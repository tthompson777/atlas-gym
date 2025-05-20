import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Aluno, AlunosService } from '../../services/alunos.service';
import { calcularIdade } from '../../utils';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Exercicio, FichaExercicio, FichaExercicioService } from '../../services/ficha-exercicio.service';
import { MatDialog } from '@angular/material/dialog';
import { FichaDialogComponent } from '../../shared/dialog-ficha/ficha-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ficha-exercicios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './ficha-exercicios.component.html',
  styleUrl: './ficha-exercicios.component.scss'
})
export class FichaExerciciosComponent {

  constructor(
    private fb: FormBuilder, 
    private alunosService: AlunosService, 
    private fichaService: FichaExercicioService, 
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastService,
  ) { }

  alunos: Aluno[] = [];
  alunoSelecionado?: { nome: string, idade: number };
  formFicha: FormGroup = new FormGroup({});
  fichaId?: number;
  editando = false;

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
      this.toast.show('Erro ao buscar alunos!', 'erro');
    }
  });

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.fichaId = Number(id);
      this.editando = true;
      this.carregarFicha(this.fichaId);
    }
  });
}

carregarFicha(id: number) {
  this.fichaService.obter(id).subscribe({
    next: (ficha) => {
      this.formFicha.patchValue({ alunoId: ficha.alunoId });

      for (const ex of ficha.exercicios) {
        const keySeries = this.getControle(ex.grupo, ex.nome, 'series');
        const keyReps = this.getControle(ex.grupo, ex.nome, 'repeticoes');
        this.formFicha.get(keySeries)?.setValue(ex.series);
        this.formFicha.get(keyReps)?.setValue(ex.repeticoes);
      }

      this.preencherDadosAluno();
    },
    error: () => 
      this.toast.show('Erro ao carregar ficha para edição!', 'erro')
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
    const idade = calcularIdade(aluno.nascimento);
    this.alunoSelecionado = { nome: aluno.nome, idade };

    // Se estiver criando nova ficha, verificar se já existe
    if (!this.editando) {
      this.fichaService.buscarPorAluno(alunoId).subscribe({
        next: (res) => {
          const dialogRef = this.dialog.open(FichaDialogComponent, {
                data: { mensagem: 'Este aluno já possui uma ficha. Deseja editar a ficha dele?' }
              });
          
              dialogRef.afterClosed().subscribe(confirmado => {
                if (confirmado) {
                  this.router.navigate(['/fichas/editar', res.id]);
                }
                else {
                  this.router.navigate(['/fichas']);
                }
              });
        
        },
        error: (err) => {
          // Se 404, tudo certo — aluno não tem ficha
          if (err.status !== 404) {
            console.error('Erro ao verificar ficha do aluno', err);
          }
        }
      });
    }
  }
}

salvarFicha() {
  if (this.formFicha.invalid) {
    this.toast.show('Preencha todos os campos obrigatórios!', 'erro');

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

  if (this.editando && this.fichaId) {
    this.fichaService.atualizar(this.fichaId, ficha).subscribe({
      next: () => {
        this.toast.show('Ficha atualizada com sucesso!', 'sucesso');
        this.router.navigate(['/fichas']);
      },
      error: (err) => {
        console.error('Erro ao atualizar ficha:', err);
        this.toast.show('Erro ao atualizar ficha!', 'erro');
      }
    });
  } else {
    this.fichaService.criar(ficha).subscribe({
      next: () => {
        this.toast.show('Ficha criada com sucesso!', 'sucesso');
        this.router.navigate(['/fichas']);
      },
      error: (err) => {
        console.error('Erro ao criar ficha:', err);
        this.toast.show('Erro ao criar ficha!', 'erro');
      }
    });
  }
}

voltar(){
  this.router.navigate(['/fichas']);
}

}
