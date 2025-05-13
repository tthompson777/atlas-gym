import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlunosService, Aluno } from '../alunos.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-formulario',
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
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './formulario.component.html',
})
export class FormularioComponent {
  aluno: Aluno = {
    id: 0,
    nome: '',
    sexo: '',
    nascimento: '',
    telefone: '',
    email: '',
    cpf: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    pais: '',
    status: 'Ativo',
  };

  editando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunosService: AlunosService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alunosService.obter(+id).subscribe((alunoEncontrado) => {
        if (alunoEncontrado) {
          this.aluno = { ...alunoEncontrado };
          this.editando = true;
        }
      });
    }
  }

  salvar() {
  if (this.editando) {
    this.alunosService.atualizar(this.aluno).subscribe(() => {
      this.router.navigate(['/alunos']);
    });
  } else {
    this.alunosService.criar(this.aluno).subscribe(() => {
      this.router.navigate(['/alunos']);
    });
  }
}

}
