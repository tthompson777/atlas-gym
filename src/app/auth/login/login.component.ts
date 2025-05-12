import { Component, Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.erro = '';
    this.authService.login(this.email, this.senha)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch((err: { message: string; }) => {
        this.erro = err.message || 'Erro ao fazer login.';
      });
  }
}
