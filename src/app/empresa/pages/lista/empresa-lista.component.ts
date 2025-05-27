import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../services/empresa.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-empresa-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './empresa-lista.component.html',
  styleUrls: ['./empresa-lista.component.scss']
})
export class EmpresaListaComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  colunas: string[] = ['id', 'nome', 'email', 'criadoEm', 'acoes'];
  dataSource = new MatTableDataSource<any>([]);
  private service = inject(EmpresaService);
  private router = inject(Router);

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.service.listarTodas().subscribe(empresas => {
      this.dataSource.data = empresas;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  visualizar(empresaId: number) {
    alert(`Visualizar empresa ${empresaId} - ou redirecionar para detalhe futuramente.`);
  }
}
