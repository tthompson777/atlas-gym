import { Component, inject, computed, signal } from '@angular/core';
import { Auth, onAuthStateChanged, User, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  user = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (u) => this.user.set(u));
  }

  ngOnInit(): void {
    this.auth.currentUser?.getIdToken().then(token => {
      console.log('Token JWT:', token);
    });
  }

  nomeUsuario = computed(() => this.user()?.displayName ?? this.user()?.email ?? 'Usuário');

  logout() {
    signOut(this.auth).then(() => this.router.navigate(['/login']));
  }
}
