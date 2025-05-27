import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-superadmin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-superadmin.component.html',
  styleUrls: ['./login-superadmin.component.scss']
})
export class LoginSuperadminComponent {
  form: FormGroup;
  erro = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  login() {
    this.erro = '';
    if (this.form.invalid) return;

    this.http.post('/api/superadmin/login', this.form.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/admin/empresas']);
      },
      error: err => {
        this.erro = err.error?.message || 'Erro ao fazer login.';
      }
    });
  }
}
