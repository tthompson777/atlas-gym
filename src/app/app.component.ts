import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FirebaseTokenInterceptor } from './core/interceptors/firebase-token.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    NgClass,
    NgIf
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: FirebaseTokenInterceptor, multi: true, }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(public router: Router) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      this.rotaPronta = true; // marca quando a rota está pronta
      console.log('Rota atual:', this.currentRoute);
    });
  }

  title = 'Atlas GYM - Gerenciador de Academia';
  currentYear = new Date().getFullYear();
  currentRoute: string = '';
  rotaPronta: boolean = false;

  isVerificarPage(): boolean {
  return this.currentRoute.startsWith('/verificar');
}
  isAlunosPage() {
    return this.router.url === '/alunos';
  }
  isAlunoNovoPage() {
    return this.router.url === '/alunos/novo';
  }
}
