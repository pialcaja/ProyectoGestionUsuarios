import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  pwd = '';
  errorMsg = '';

  private returnUrl: string | null = null;

  constructor(private auth: Auth, private router: Router, private route: ActivatedRoute) {
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

        if (role == 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/general']);
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: 'El email o la contraseña no son correctos. Intente de nuevo.'
        });
      }
    });
  }
}
