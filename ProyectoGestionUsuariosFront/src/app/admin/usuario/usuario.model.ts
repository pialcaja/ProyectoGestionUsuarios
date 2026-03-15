export interface UsuarioListado {
  nombre: string;
  apepa: string;
  apema: string;
  email: string;
  rol: string;
}

export interface UsuarioAdminRequest {
  nombre: string;
  apepa: string;
  apema: string;
  email: string;
  pwd?: string;
  fecha_nacimiento: string;
  idRol: number;
}
