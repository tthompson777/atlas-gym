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
import { FichaExerciciosComponent } from './ficha-exercicios/criar-editar/ficha-exercicios.component';
import { FichaExerciciosListaComponent } from './ficha-exercicios/lista/lista.component';
import { EmpresaNovaComponent } from './empresa/pages/nova/empresa-nova.component';
import { EmpresaListaComponent } from './empresa/pages/lista/empresa-lista.component';
import { AdminLayoutComponent } from './layouts/adm/admin-layout.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminLayoutComponent, },
  // TODO: adicionar superAdminGuard futuramente

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
      { path: 'financeiro/editar/:id', component: FinanceiroEditarComponent },

      // 👇 Rotas Ficha de Exercícios
      { path: 'fichas', component: FichaExerciciosListaComponent },
      { path: 'fichas/nova', component: FichaExerciciosComponent },
      { path: 'fichas/editar/:id', component: FichaExerciciosComponent },

      // 👇 Rotas Empresa
      { path: 'empresa/nova', component: EmpresaNovaComponent },

      // ADM Empresas
      { path: 'admin/empresas', component: EmpresaListaComponent }
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
