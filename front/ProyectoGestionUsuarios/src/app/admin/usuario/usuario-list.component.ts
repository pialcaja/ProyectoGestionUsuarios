import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { UsuarioAdminApi } from './usuario-admin-api';
import { UsuarioForm } from './usuario-form.component';
import { FormsModule } from '@angular/forms';
import { Alerta } from '../../shared/alerts/alerta.service';
import { Auth } from '../../core/auth/auth-api';
import { FechaFormato } from '../../shared/pipes/fechaFormato.pipe';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuarioForm, FechaFormato],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css',
})
export class UsuarioList implements OnInit {

  usuarios = signal<any[]>([]);
  page = 0;
  size = 5;
  totalPaginas = 0;
  filtro = '';
  estado = true;
  mostrarModal = false;
  usuarioIdSeleccionado?: number;
  usuarioSeleccionado = signal<any | null>(null);
  mostrarModalVer = signal(false);

  constructor(private usuarioService: UsuarioAdminApi, private alert: Alerta, private authService: Auth) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  aplicarFiltros() {
    this.page = 0;
    this.cargarUsuarios();
  }

  limpiarFiltros() {
    this.filtro = '';
    this.estado = true;
    this.page = 0;
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar({
      page: this.page,
      size: this.size,
      filtro: this.filtro,
      estado: this.estado
    }).subscribe(resp => {
      this.usuarios.set(resp.usuarios);
      this.totalPaginas = resp.totalPaginas;
      this.page = resp.paginaActual;
    });
  }

  paginaAnterior() {
    if (this.page > 0) {
      this.page--;
      this.cargarUsuarios();
    }
  }

  paginaSiguiente() {
    if (this.page < this.totalPaginas - 1) {
      this.page++;
      this.cargarUsuarios;
    }
  }

  irAPagina(p: number) {
    this.page = p;
    this.cargarUsuarios();
  }

  verUsuario(id: number) {
    this.usuarioService.obtener(id).subscribe({
      next: resp => {
        this.usuarioSeleccionado.set(resp.usuario);
        this.mostrarModalVer.set(true);
      },
      error: err => {
        this.alert.error('Error', err.error?.mensaje || 'No se pudo obtener el usuario');
      }
    });
  }

  cerrarModalVer() {
    this.usuarioSeleccionado.set(null);
    this.mostrarModalVer.set(false);
  }

  eliminar(id: number) {
    this.alert.confirm(
      '¿Eliminar usuario?',
      'El usuario quedará inactivo',
      'Si, eliminar'
    ).then(result => {
      if (!result.isConfirmed) return;

      this.alert.loading();

      this.usuarioService.eliminar(id).subscribe({
        next: (resp) => {
          this.alert.success('Eliminado', resp.mensaje);
          this.cargarUsuarios();
        },
        error: (err) => {
          this.alert.error(
            'Error',
            err.error?.mensaje || 'No se pudo eliminar'
          );
        }
      });
    });
  }

  recuperar(id: number) {
    this.alert.confirm(
      '¿Recuperar usuario?',
      'El usuario volverá a estar activo',
      'Si, recuperar'
    ).then(result => {
      if (!result.isConfirmed) return;

      this.alert.loading();

      this.usuarioService.recuperar(id).subscribe({
        next: (resp) => {
          this.alert.success('Recuperado', resp.mensaje);
          this.cargarUsuarios();
        },
        error: (err) => {
          this.alert.error(
            'Error',
            err.error?.mensaje || 'No se pudo recuperar'
          );
        }
      });
    });
  }

  abrirCrear() {
    this.usuarioIdSeleccionado = undefined;
    this.mostrarModal = true;
  }

  editar(id: number) {
    this.usuarioIdSeleccionado = id;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  recargar() {
    this.cargarUsuarios();
  }
}
