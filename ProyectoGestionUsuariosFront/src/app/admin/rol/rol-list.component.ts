import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { Rol } from "./rol-api";
import { RolForm } from "./rol-form.component";
import { FormsModule } from "@angular/forms";
import { Alerta } from "../../shared/alerts/alerta.service";

@Component({
  selector: 'app-rol-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RolForm],
  templateUrl: './rol-list.component.html'
})
export class RolList implements OnInit {

  roles = signal<any[]>([]);
  page = 0;
  size = 5;
  totalPaginas = 0;
  filtro = '';

  mostrarForm = false;
  rolIdSeleccionado?: number;

  constructor(
    private rolService: Rol,
    private alert: Alerta
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  aplicarFiltros() {
    if (!this.filtro || !this.filtro.trim()) return;

    this.page = 0;
    this.cargarRoles();
  }

  limpiarFiltros() {
    this.filtro = '';
    this.page = 0;
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.listar({
      page: this.page,
      size: this.size,
      filtro: this.filtro
    }).subscribe(resp => {
      this.roles.set(resp.roles);
      this.totalPaginas = resp.totalPaginas;
      this.page = resp.paginaActual;
    });
  }

  irAPagina(p: number) {
    this.page = p;
    this.cargarRoles();
  }

  abrirCrear() {
    this.rolIdSeleccionado = undefined;
    this.mostrarForm = true;
  }

  editar(id: number) {
    this.rolIdSeleccionado = id;
    this.mostrarForm = true;
  }

  cerrarForm() {
    this.mostrarForm = false;
  }

  recargar() {
    this.cargarRoles();
  }
}
