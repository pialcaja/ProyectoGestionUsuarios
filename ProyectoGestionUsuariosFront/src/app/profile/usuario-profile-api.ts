import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UsuarioProfileApi {

    private API = 'http://localhost:8080/api/usuario';

    constructor(private http: HttpClient) {}

    obtenerMiPerfil(): Observable<any> {
        return this.http.get(`${this.API}/me`);
    }

    actualizarMiPerfil(data: any): Observable<any> {
        return this.http.put(`${this.API}/me`, data);
    }
}