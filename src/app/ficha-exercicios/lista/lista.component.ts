import { Component, OnInit, ViewChild } from '@angular/core';
import { FichaExercicioService, FichaExercicio } from '../../services/ficha-exercicio.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { NoDataTableComponent } from '../../shared/no-data-table/no-data-table.component';

@Component({
  selector: 'app-ficha-exercicios-lista',
  standalone: true,
  templateUrl: './lista.component.html',
  imports: [CommonModule, MatIconModule, MatCardModule, MatPaginator, MatTableModule, MatTooltipModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, NoDataTableComponent],
})
export class FichaExerciciosListaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  fichas: FichaExercicio[] = [];
  colunas: string[] = ['aluno', 'dataCriacao', 'acoes'];
  dataSource = new MatTableDataSource<FichaExercicio>([]);
  filtro: string = '';

  constructor(private fichaService: FichaExercicioService, private router: Router) {}

  ngOnInit(): void {
    this.carregar();

    this.dataSource.filterPredicate = (data: FichaExercicio, filtro: string) => {
      const nome = data.aluno?.nome?.toLowerCase();
      return nome ? nome.includes(filtro) : false;
    };
  }

  carregar(): void {
    this.fichaService.listar().subscribe(fichas => {
      this.fichas = fichas;
      this.dataSource.data = fichas;

      // Garante que o paginator é atribuído após os dados estarem prontos
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
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
