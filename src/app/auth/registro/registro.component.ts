import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  erro = '';

  constructor(private auth: Auth, private router: Router, private toast: ToastService,) {}

  async registrar() {
    this.erro = '';
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, this.email, this.senha);
      await updateProfile(cred.user, { displayName: this.nome });

      this.toast.show('Usuário registrado com sucesso!', 'sucesso');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.erro = err.message || 'Erro ao registrar.';
    }
  }
}
