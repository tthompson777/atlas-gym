import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private router = inject(Router);

  token = signal(localStorage.getItem('token'));
  nome = signal(localStorage.getItem('nome') || 'Usuário');

  nomeUsuario = computed(() => this.nome());

  ngOnInit(): void {
    // Opcional: buscar dados atualizados do usuário
    // Exemplo:
    // this.http.get('/api/me').subscribe({ next: (u: any) => this.nome.set(u.nome) })
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('nome'); // se estiver armazenando
    this.router.navigate(['/login']);
  }
}
