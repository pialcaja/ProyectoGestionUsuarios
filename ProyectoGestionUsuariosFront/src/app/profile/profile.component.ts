import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../core/auth/auth-api';
import { CommonModule } from '@angular/common';
import { UsuarioPerfil } from './profile.model';
import { UsuarioProfileApi } from './usuario-profile-api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alerta } from '../shared/alerts/alerta.service';
import { nacimientoValidator, soloLetrasValidator } from '../shared/validators/custom-validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class Profile implements OnInit {

  perfil = signal<UsuarioPerfil | null>(null);
  form!: FormGroup;
  isCargando = false;
  mostrarFormulario = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private profileApi: UsuarioProfileApi,
    private alert: Alerta
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    if (this.authService.isLogged()) {
      this.cargarPerfil();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, soloLetrasValidator]],
      apepa: ['', [Validators.required, soloLetrasValidator]],
      apema: ['', [Validators.required, soloLetrasValidator]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      pwd: [''],
      fecha_nacimiento: ['', [Validators.required, nacimientoValidator]]
    });
  }

  cargarPerfil() {
    this.isCargando = true;
    this.profileApi.obtenerMiPerfil().subscribe({
      next: resp => {
        const usuario = resp.usuario;
        this.perfil.set(usuario);
        this.form.patchValue({
          nombre: usuario.nombre,
          apepa: usuario.apepa,
          apema: usuario.apema,
          email: usuario.email,
          fecha_nacimiento: usuario.fecha_nacimiento
        });
        this.isCargando = false;
      },
      error: err => {
        console.error('Error al cargar perfil', err);
        this.isCargando = false;
      }
    });
  }

  mostrarFormActualizar() {
    this.mostrarFormulario.set(true);
  }

  ocultarForm() {
    this.mostrarFormulario.set(false);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.alert.confirm(
      '¿Actualizar perfil?',
      'Se actualizarán tus datos'
    ).then(result => {
      if (!result.isConfirmed) return;

      this.alert.loading();

      this.profileApi.actualizarMiPerfil(this.form.value).subscribe({
        next: resp => {
          this.perfil.set(resp.usuario);
          this.ocultarForm();

          this.alert.success(
            'Perfil actualizado',
            'Tus datos han sido actualizados. Por seguridad, debes iniciar sesión nuevamente.'
          ).then(() => {
            this.logout();
          });

        },
        error: err => {
          console.error('Error al actualizar perfil', err);
          this.alert.error('Error', err.error?.mensaje || 'No se pudo actualizar el perfil');
        }
      });
    });
  }

  logout() {
    this.authService.logout();
  }
}
