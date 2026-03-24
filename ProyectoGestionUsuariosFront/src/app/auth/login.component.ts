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

  // Datos enlazados al formulario
  email = '';
  pwd = '';

  // Control del estado de visibilidad de la contraseña
  showPassword = false;

  // Mensaje de error (si luego decides mostrarlo en vista)
  errorMsg = '';

  // URL de retorno para redirección post-login
  private returnUrl: string | null = null;

  constructor(
    // Servicio de autenticación
    private auth: Auth,

    // Navegación y manejo de rutas
    private router: Router,
    private route: ActivatedRoute,

    // Servicio de alertas personalizadas
    private alert: Alerta
  ) {
    // Obtiene la URL protegida original si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
  }

  // Ejecuta el proceso de autenticación
  login() {
    this.auth.login({ email: this.email, pwd: this.pwd }).subscribe({
      next: (res) => {
        // Persistencia de tokens y rol
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('role', res.rol);

        const role = res.rol;

        // Redirección a la ruta solicitada originalmente
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // Redirección según rol
        this.router.navigate(role === 'ADMIN' ? ['/admin'] : ['/profile']);
      },
      error: (err) => {
        // Limpieza de sesión ante error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');

        // Notificación de error al usuario
        this.alert.error(
          'Error',
          err.error?.mensaje || 'Credenciales incorrectas'
        );
      }
    });
  }

  // Alterna la visibilidad de la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
