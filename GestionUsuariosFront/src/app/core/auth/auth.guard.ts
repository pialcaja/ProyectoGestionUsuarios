import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth-api';

export const authGuard: CanActivateFn = () => {

  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
