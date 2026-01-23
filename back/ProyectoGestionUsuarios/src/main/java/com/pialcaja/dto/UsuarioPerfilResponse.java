package com.pialcaja.dto;

import java.time.LocalDate;

import com.pialcaja.model.Usuario;

import lombok.Data;

@Data
public class UsuarioPerfilResponse {

	private Long id;
	private String nombre;
	private String apepa;
	private String apema;
	private String email;
	private LocalDate fecha_nacimiento;

	public static UsuarioPerfilResponse fromEntity(Usuario u) {
		UsuarioPerfilResponse dto = new UsuarioPerfilResponse();
		dto.setId(u.getId());
		dto.setNombre(u.getNombre());
		dto.setApepa(u.getApepa());
		dto.setApema(u.getApema());
		dto.setEmail(u.getEmail());
		dto.setFecha_nacimiento(u.getFecha_nacimiento());
		return dto;
	}
}
