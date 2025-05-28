import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

const URL_API = environment.URL;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('empresaId');
  }

  registrar() {
    this.erro = '';
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    this.http.post<{ token: string }>(`${URL_API}/registro`, {
      nome: this.nome,
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this.toast.show('Usuário registrado com sucesso!', 'sucesso');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.erro = err.error?.erro || 'Erro ao registrar.';
      }
    });
  }
}
