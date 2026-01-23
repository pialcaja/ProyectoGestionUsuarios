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
      next: () => {
        const role = this.auth.getRole();

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        this.router.navigate(
          role === 'ADMIN' ? ['/admin'] : ['/profile']
        );
      },
      error: (err) => {
        this.alert.error(
          'Error',
          err.error?.mensaje || 'Acceso denegado'
        );
      }
    });
  }
}
