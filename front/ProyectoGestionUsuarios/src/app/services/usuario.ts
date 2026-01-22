import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioAdminRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  
  private API = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  listar(params: {
    page?: number;
    size?: number;
    filtro?: string;
    estado?: boolean;
  }) {
    return this.http.get<any>(this.API, { params });
  }

  obtener(id: number) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  registrar(data: UsuarioAdminRequest) {
    return this.http.post<any>(this.API, data);
  }

  actualizar(id: number, data: UsuarioAdminRequest) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }
  
  eliminar(id: number) {
    return this.http.put<any>(`${this.API}/eliminar/${id}`, {});
  }
  
  recuperar(id: number) {
    return this.http.put<any>(`${this.API}/recuperar/${id}`, {});
  }

  listarRoles() {
    return this.http.get<any[]>(`${this.API}/roles`);
  }
}
