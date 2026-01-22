import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { Usuario } from '../../../services/usuario';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuarioForm],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
})
export class UsuarioList implements OnInit {

  usuarios = signal<any[]>([]);
  page = 0;
  size = 10;
  filtro = '';
  estado = true;
  mostrarModal = false;
  usuarioIdSeleccionado?: number;

  constructor(private usuarioService: Usuario) { }

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
    });
  }

  eliminar(id: number) {
    this.usuarioService.eliminar(id).subscribe(() => {
      this.cargarUsuarios();
    });
  }

  recuperar(id: number) {
    this.usuarioService.recuperar(id).subscribe(() => {
      this.cargarUsuarios();
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
