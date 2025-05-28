import { Component, Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    private empresaService: EmpresaService
  ) {}

  login() {
    this.erro = '';
    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.empresaService.buscarMinhaEmpresa().subscribe({
          next: (empresa) => {
            localStorage.setItem('empresaId', empresa.id);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.erro = 'Erro ao buscar empresa do usuário.';
          }
        });
      },
      error: err => {
        this.erro = err.error?.erro || 'Credenciais inválidas.';
      }
    });
  }
}
