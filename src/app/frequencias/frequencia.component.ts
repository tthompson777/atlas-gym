import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistroAcessoService, RegistroAcesso } from '../services/registro-acesso.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AlunosService } from '../services/alunos.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TagStatusComponent } from '../shared/tag-status/tag-status.component';

@Component({
  selector: 'app-frequencia',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, TagStatusComponent],
  templateUrl: './frequencia.component.html'
})
export class FrequenciaComponent implements OnInit {
  registros: RegistroAcesso[] = [];
  aluno: any;
  displayedColumns = ['data', 'diaSemana', 'entrada', 'saida'];
  fotoSegura: SafeUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private registroService: RegistroAcessoService,
    private alunosService: AlunosService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const alunoId = Number(this.route.snapshot.paramMap.get('id'));

    this.alunosService.obter(alunoId).subscribe(aluno => {
      this.aluno = aluno;
      this.fotoSegura = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + aluno.fotoBase64);
    });

    this.registroService.listarPorAluno(alunoId).subscribe(registros => {
      this.registros = registros;
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString();
  }

  formatarHora(data: string): string {
    return new Date(data).toLocaleTimeString();
  }

  diaSemana(data: string): string {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[new Date(data).getDay()];
  }
}
