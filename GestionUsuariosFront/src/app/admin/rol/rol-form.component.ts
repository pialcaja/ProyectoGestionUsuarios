import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Rol } from "./rol-api";
import { Alerta } from "../../shared/alerts/alerta.service";
import { soloLetrasValidator } from "../../shared/validators/custom-validators";

@Component({
  selector: 'app-rol-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rol-form.component.html'
})
export class RolForm implements OnChanges {

  @Input() rolId?: number;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  form!: FormGroup;
  esEdicion = false;

  constructor(
    private fb: FormBuilder,
    private rolService: Rol,
    private alert: Alerta
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolId']) {
      this.esEdicion = !!this.rolId;

      this.resetForm();

      if (this.rolId) {
        this.cargarRol();
      }
    }
  }

  buildForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, soloLetrasValidator, Validators.maxLength(50)]],
      descripcion: ['', [soloLetrasValidator]]
    });
  }

  private resetForm(): void {
    this.form.reset({
      nombre: '',
      descripcion: ''
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  cargarRol() {
    if (!this.rolId) return;

    this.rolService.obtener(this.rolId).subscribe(resp => {
      const r = resp.rol;

      this.form.patchValue({
        nombre: r.nombre,
        descripcion: r.descripcion
      });
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    const accion = this.esEdicion ? 'Actualizar' : 'Registrar';

    this.alert.confirm(
      `¿${accion} rol?`,
      'Confirma la operación'
    ).then(result => {
      if (!result.isConfirmed) return;

      this.alert.loading();

      const request$ = this.esEdicion && this.rolId
        ? this.rolService.actualizar(this.rolId, data)
        : this.rolService.registrar(data);

      request$.subscribe({
        next: (resp) => {
          this.alert.success('Éxito', resp.mensaje);
          this.guardado.emit();
          this.cerrarForm();
        },
        error: (err) => {
          this.alert.error(
            'Error',
            err.error?.mensaje || 'Error al guardar rol'
          );
        }
      });
    });
  }

  cerrarForm() {
    this.form.reset();
    this.cerrar.emit();
  }
}
