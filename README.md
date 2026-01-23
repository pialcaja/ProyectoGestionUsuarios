# Proyecto Gestión de Usuarios

Sistema de gestión de usuarios y roles con autenticación JWT, desarrollado con **Spring Boot** en el backend y **Angular** en el frontend.

---

## Tecnologías utilizadas

### Backend
- Java 21
- Spring Boot 3.5
- Spring Data JPA y JDBC
- Spring Security con JWT
- MySQL 8
- Lombok
- Validación con Hibernate Validator
- Maven como gestor de dependencias

### Frontend
- Angular 21
- RxJS
- SweetAlert2 para alertas y confirmaciones
- TypeScript
- NPM como gestor de paquetes

---

## Base de datos

- Motor: **MySQL 8**
- Nombre de la base: `bd_gestion_usuarios`
- Tablas principales:
  - `tb_rol` → almacena los roles (`ADMIN` y `CLIENTE`)
  - `tb_usuario` → almacena usuarios con relación a `tb_rol`
- Usuario admin inicial configurado para pruebas:
  - **Email:** `piero@ejemplo.com`
  - **Contraseña:** `Piero123@`
  - **Rol:** ADMIN

> Todos los scripts de creación de tablas y datos base se encuentran en el repositorio.

---
