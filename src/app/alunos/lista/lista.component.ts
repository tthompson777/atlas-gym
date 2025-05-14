import { Component } from '@angular/core';
import { AlunosService, Aluno } from '../alunos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BotaoComponent } from '../../shared/botao/botao.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { calcularIdade } from '../../utils';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import * as faceapi from 'face-api.js';
import { FaceRecognitionService } from '../../services/face-recognition.service';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [CommonModule, BotaoComponent, MatIconModule, MatCardModule, MatTableModule, MatTooltipModule, MatPaginator, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Aluno>([]);
  alunos: Aluno[] = [];
  colunas: string[] = [
    'foto',
    'id',
    'nome',
    'sexo',
    'nascimento',
    'telefone',
    'email',
    'cpf',
    'status',
    'acoes'
  ];
  filtro: string = '';

  constructor(private alunosService: AlunosService, private router: Router, private dialog: MatDialog, private faceRecognition: FaceRecognitionService) {}

  ngOnInit() {
    this.carregar();

      this.dataSource.filterPredicate = (data: Aluno, filtro: string) => {
      const nome = data.nome.toLowerCase();
      const cpf = data.cpf.toLowerCase();
      return nome.includes(filtro) || cpf.includes(filtro);
    };

    // Carrega os modelos na inicialização
  this.faceRecognition.loadModels().then(() => {
    console.log('Modelos carregados com sucesso');
  }).catch(err => {
    console.error('Erro ao carregar modelos:', err);
  });

  }

  carregar(): void {
    this.alunosService.listar().subscribe(alunos => {
      this.dataSource.data = alunos;

      // Garante que o paginator é atribuído após os dados estarem prontos
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  novoAluno() {
    this.router.navigate(['/alunos/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/alunos/editar', id]);
  }

  inativar(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mensagem: 'Deseja realmente inativar este aluno?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.alunosService.inativar(id).subscribe({
          next: () => {
            console.log('Aluno inativado');
            this.carregar();
          },
          error: err => console.error('Erro ao inativar aluno:', err)
        });
      }
    });
  }

  excluir(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mensagem: 'Deseja realmente excluir este aluno?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.alunosService.excluir(id).subscribe({
          next: () => {
            console.log('Aluno excluído');
            this.carregar();
          },
          error: err => console.error('Erro ao excluir aluno:', err)
        });
      }
    });
  }

  idadeAluno(dataNascimento: string | Date): number {
    return calcularIdade(dataNascimento);
  }

  aplicarFiltro(): void {
  this.dataSource.filter = this.filtro.trim().toLowerCase();
}

}
