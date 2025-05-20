import { Component, OnInit } from '@angular/core';
import { FichaExercicioService, FichaExercicio } from '../../services/ficha-exercicio.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoDataTableComponent } from '../../shared/no-data-table/no-data-table.component';

@Component({
  selector: 'app-ficha-exercicios-lista',
  standalone: true,
  templateUrl: './lista.component.html',
  imports: [CommonModule, MatIconModule, MatCardModule, MatTableModule, MatTooltipModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, NoDataTableComponent],
})
export class FichaExerciciosListaComponent implements OnInit {
  fichas: FichaExercicio[] = [];
  colunas: string[] = ['aluno', 'dataCriacao', 'acoes'];

  constructor(private fichaService: FichaExercicioService, private router: Router) {}

  ngOnInit(): void {
    this.fichaService.listar().subscribe(fichas => this.fichas = fichas);
  }

  novaFicha() {
    this.router.navigate(['/fichas/nova']);
  }

  editar(id: number) {
    this.router.navigate(['/fichas/editar', id]);
  }

  excluir(id: number) {
    if (confirm('Deseja excluir esta ficha?')) {
      this.fichaService.excluir(id).subscribe(() => this.ngOnInit());
    }
  }
}
