import { Component, Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EmpresaService } from '../../services/empresa.service';

 @Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private empresaService: EmpresaService,
  ) {}

  login() {
  this.erro = '';

  this.authService.login(this.email, this.senha)
    .then((cred) => {
      const uid = cred.user.uid;
      const email = cred.user.email || '';

      localStorage.setItem('uid', uid);

      this.empresaService.buscarPorUid(uid).subscribe({
        next: (empresa) => {
          localStorage.setItem('empresaId', empresa.id);
          this.router.navigate(['/dashboard']);
        },
        error: async (err) => {
          console.log('Erro ao buscar empresa:', err);
          if (err.status === 404) {
            const nome = prompt('Informe o nome da empresa (academia):');
            if (!nome) {
              this.erro = 'Nome da empresa é obrigatório.';
              return;
            }

            this.empresaService.cadastrar({
              nome, email, uid,
            }).subscribe({
              next: (empresaCriada) => {
                localStorage.setItem('empresaId', empresaCriada.id);
                this.router.navigate(['/dashboard']);
              },
              error: (e) => {
                this.erro = 'Erro ao cadastrar empresa.';
              }
            });
          } else {
            this.erro = 'Erro ao buscar empresa.';
          }
        }
      });
    })
    .catch((err: { message: string }) => {
      this.erro = err.message || 'Erro ao fazer login.';
    });
}
}
