import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getPtBrPaginatorIntl } from './app/shared/mat-paginator-intl-pt';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TokenInterceptor } from './app/core/interceptors/token.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatCardModule,
      MatTableModule,
      MatIconModule,
      MatToolbarModule,
      FormsModule,
      ReactiveFormsModule,
      MatSidenavModule,
      MatSlideToggleModule,
      MatTooltipModule,
      MatPaginatorModule,
      MatSnackBarModule
    ),
    { provide: MatPaginatorIntl, useValue: getPtBrPaginatorIntl() }
  ]
});
