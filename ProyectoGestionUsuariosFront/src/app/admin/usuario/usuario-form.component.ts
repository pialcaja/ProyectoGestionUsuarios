import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioAdminApi } from './usuario-admin-api';
import { Alerta } from '../../shared/alerts/alerta.service';
import { nacimientoValidator, passwordValidator, soloLetrasValidator } from '../../shared/validators/custom-validators';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css',
})
export class UsuarioForm implements OnInit, OnChanges {

  @Input() usuarioId?: number;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  form!: FormGroup;
  esEdicion = false;
  roles = signal<any[]>([]);

  constructor(private fb: FormBuilder, private usuarioService: UsuarioAdminApi, private alert: Alerta) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioId']) {
      this.esEdicion = !!this.usuarioId;

      this.resetForm();

      const pwdCtrl = this.form.get('pwd');

      if (this.esEdicion) {
        pwdCtrl?.clearValidators();
        pwdCtrl?.clearAsyncValidators();
      } else {
        pwdCtrl?.setValidators([Validators.required, passwordValidator]);
        pwdCtrl?.clearAsyncValidators();
      }

      pwdCtrl?.updateValueAndValidity();

      if (this.usuarioId) {
        this.cargarUsuario();
      } else {
        this.form.reset();
      }
    }
  }

  buildForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, soloLetrasValidator]],
      apepa: ['', [Validators.required, soloLetrasValidator]],
      apema: ['', [Validators.required, soloLetrasValidator]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      pwd: [''],
      fecha_nacimiento: ['', [Validators.required, nacimientoValidator]],
      idRol: [null, Validators.required]
    });
  }

  private resetForm(): void {
    this.form.reset({
      nombre: '',
      apepa: '',
      apema: '',
      email: '',
      pwd: '',
      fecha_nacimiento: '',
      idRol: null
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  cargarUsuario() {
    if (!this.usuarioId) return;

    this.usuarioService.obtener(this.usuarioId).subscribe(resp => {
      const u = resp.usuario;

      this.form.patchValue({
        nombre: u.nombre,
        apepa: u.apepa,
        apema: u.apema,
        email: u.email,
        fecha_nacimiento: u.fecha_nacimiento,
        pwd: '',
        idRol: u.rol?.id
      });
    });
  }

  cargarRoles() {
    this.usuarioService.listarRoles().subscribe(resp => {
      this.roles.set(resp);
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    const accion = this.esEdicion? 'Actualizar' : 'Registrar';

    this.alert.confirm(
      `¿${accion} usuario?`,
      'Confirma la operacion'
    ).then(result => {
      if (!result.isConfirmed) return;

      this.alert.loading();

      const request$ = this.esEdicion && this.usuarioId
        ? this.usuarioService.actualizar(this.usuarioId, data)
        : this.usuarioService.registrar(data);
      
      request$.subscribe({
        next: (resp) => {
          this.alert.success('Éxito', resp.mensaje);
          this.guardado.emit();
          this.cerrarModal();
        },
        error: (err) => {
          this.alert.error(
            'Error',
            err.error?.mensaje || 'Error al guardar usuario'
          );
        }
      });
    });
  }

  cerrarModal() {
    this.form.reset();
    this.cerrar.emit();
  }
}
