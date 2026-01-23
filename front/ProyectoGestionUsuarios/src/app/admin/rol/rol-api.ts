import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class Rol {

  private API = 'http://localhost:8080/api/rol';

  constructor(private http: HttpClient) {}

  listar(params: {
    page?: number;
    size?: number;
    filtro?: string;
  }) {
    return this.http.get<any>(this.API, { params });
  }

  obtener(id: number) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  registrar(data: any) {
    return this.http.post<any>(this.API, data);
  }

  actualizar(id: number, data: any) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }
}
