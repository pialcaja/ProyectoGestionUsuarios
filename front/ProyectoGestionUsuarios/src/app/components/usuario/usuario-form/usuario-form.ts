import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../services/usuario';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm implements OnInit, OnChanges {

  @Input() usuarioId?: number;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  form!: FormGroup;
  esEdicion = false;
  roles = signal<any[]>([]);

  constructor(private fb: FormBuilder, private usuarioService: Usuario) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioId']) {
      this.esEdicion = !!this.usuarioId;

      if (this.usuarioId) {
        this.cargarUsuario();
      } else {
        this.form.reset();
      }
    }
  }

  buildForm() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apepa: ['', Validators.required],
      apema: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pwd: [''],
      fecha_nacimiento: ['', Validators.required],
      idRol: [null, Validators.required]
    });
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

    if (this.esEdicion && this.usuarioId) {
      this.usuarioService.actualizar(this.usuarioId, data).subscribe(() => {
        this.guardado.emit();
        this.cerrarModal();
      });
    } else {
      this.usuarioService.registrar(data).subscribe(() => {
        this.guardado.emit();
        this.cerrarModal();
      });
    }
  }

  cerrarModal() {
    this.form.reset();
    this.cerrar.emit();
  }
}
