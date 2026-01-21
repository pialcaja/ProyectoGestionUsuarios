import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class rolGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }

    const path = route.routeConfig?.path;

    if (this.auth.hasRole('ADMIN')) {
      if (path === 'general') {
        this.router.navigate(['/admin']);
        return false;
      }
      return true;
    }

    if (path === 'admin') {
      this.router.navigate(['/general']);
      return false;
    }

    return true;
  }
};
