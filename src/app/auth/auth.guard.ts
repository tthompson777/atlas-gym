import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const isAuthenticated = await new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(!!user);
    });
  });

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
