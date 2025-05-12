import { Component } from '@angular/core';
import { AlunosService, Aluno } from '../alunos.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent {
  alunos: Aluno[] = [];

  constructor(private alunosService: AlunosService, private router: Router) {
    this.carregar();
  }

  carregar() {
    this.alunosService.listar().subscribe(alunos => this.alunos = alunos);
  }

  editar(id: number) {
    this.router.navigate(['/alunos/editar', id]);
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir?')) {
      this.alunosService.excluir(id);
      this.carregar();
    }
  }

  inativar(id: number) {
    this.alunosService.inativar(id);
    this.carregar();
  }
}
