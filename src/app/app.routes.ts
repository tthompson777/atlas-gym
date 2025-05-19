import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { LandingComponent } from './core/landing/landing.component';
import { ListaComponent } from './alunos/lista/lista.component';
import { FormularioComponent } from './alunos/formulario/formulario.component';
import { HomeComponent } from './dashboard/home/home.component';
import { FaceVerificationComponent } from './face-verification/face-verification.component';
import { VerificarLayoutComponent } from './layouts/verificar-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { FinanceiroListaComponent } from './financeiro/pages/lista/lista.component';
import { FinanceiroEditarComponent } from './financeiro/pages/editar/editar.component';
import { FinanceiroNovoComponent } from './financeiro/pages/novo/novo.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'alunos', component: ListaComponent },
      { path: 'alunos/novo', component: FormularioComponent },
      { path: 'alunos/editar/:id', component: FormularioComponent },

      // 👇 Rotas do Financeiro
      { path: 'financeiro', component: FinanceiroListaComponent },
      { path: 'financeiro/novo', component: FinanceiroNovoComponent },
      { path: 'financeiro/editar/:id', component: FinanceiroEditarComponent }
    ]
  },

  {
    path: 'verificar',
    component: VerificarLayoutComponent,
    children: [
      { path: '', component: FaceVerificationComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
