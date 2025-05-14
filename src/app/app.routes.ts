import { Routes } from '@angular/router';
import { FormularioComponent } from './alunos/formulario/formulario.component';
import { ListaComponent } from './alunos/lista/lista.component';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { LandingComponent } from './core/landing/landing.component';
import { HomeComponent } from './dashboard/home/home.component';
import { FaceVerificationComponent } from './face-verification/face-verification.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // inteligente
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'alunos', component: ListaComponent },
      { path: 'alunos/novo', component: FormularioComponent },
      { path: 'alunos/editar/:id', component: FormularioComponent },
      { path: 'verificar', component: FaceVerificationComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
