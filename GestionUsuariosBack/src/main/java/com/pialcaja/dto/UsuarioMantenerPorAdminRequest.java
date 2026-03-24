package com.pialcaja.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UsuarioMantenerPorAdminRequest {

	private String nombre;
	private String apepa;
	private String apema;
	private String email;
	private String pwd;
	private LocalDate fecha_nacimiento;
	private Long idRol;
}
