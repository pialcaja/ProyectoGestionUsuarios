import { Component } from '@angular/core';
import { Auth } from '../core/auth/auth-api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Alerta } from '../shared/alerts/alerta.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {

  email = '';
  pwd = '';
  errorMsg = '';

  private returnUrl: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private alert: Alerta
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
  }

  login() {
    this.auth.login({ email: this.email, pwd: this.pwd }).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('role', res.rol);

        const role = res.rol;

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        this.router.navigate(role === 'ADMIN' ? ['/admin'] : ['/profile']);
      },
      error: (err) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');

        this.alert.error(
          'Error',
          err.error?.mensaje || 'Credenciales incorrectas'
        );
      }
    });
  }
}
