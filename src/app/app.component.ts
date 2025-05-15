import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(public router: Router) {}

  title = 'Atlas GYM - Gerenciador de Academia';
  currentYear = new Date().getFullYear();

  isVerificarPage() {
  return this.router.url === '/verificar';
}
}
