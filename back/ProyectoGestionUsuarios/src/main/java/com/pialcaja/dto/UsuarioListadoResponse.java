package com.pialcaja.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioListadoResponse {

	private String nombre;
	private String apepa;
	private String apema;
	private String email;
	private String rol;
}
