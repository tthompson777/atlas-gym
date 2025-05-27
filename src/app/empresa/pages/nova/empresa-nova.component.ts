import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmpresaService } from '../../../services/empresa.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empresa-nova',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './empresa-nova.component.html',
  styleUrls: ['./empresa-nova.component.scss']
})
export class EmpresaNovaComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: EmpresaService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      uid: [localStorage.getItem('uid') || '']
    });
  }

  salvar() {
    if (this.form.invalid) return;

    console.log('Dados enviados para o backend:', this.form.value);

    this.service.cadastrar(this.form.value).subscribe({
      next: (empresa) => {
        localStorage.setItem('empresaId', empresa.id);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar empresa:', err);
        alert('Erro ao cadastrar empresa. Verifique se o UID já foi usado.');
      }
    });
  }
}
