package com.pialcaja.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.pialcaja.dto.UsuarioMantenerPorAdminRequest;
import com.pialcaja.service.UsuarioService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

	@Autowired
	private UsuarioService service;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> listar(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10")int size,
			@RequestParam(required = false) String filtro,
			@RequestParam(defaultValue = "1") Boolean estado
	) {
		return service.listarUsuarios(page, size, filtro, estado);
	}
	
	@PostMapping
	public ResponseEntity<Map<String, Object>> registrar(@RequestBody UsuarioMantenerPorAdminRequest request) {
		return service.registrarUsuarioDesdeAdmin(request);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> obtener(@PathVariable Long id) {
		return service.obtenerUsuarioPorId(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> actualizar(@PathVariable Long id, @RequestBody UsuarioMantenerPorAdminRequest request) {
		return service.actualizarUsuarioDesdeAdmin(id, request);
	}
	
	@PutMapping("/eliminar/{id}")
	public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long id) {
		return service.eliminarUsuario(id);
	}
	
	@PutMapping("/recuperar/{id}")
	public ResponseEntity<Map<String, Object>> recuperar(@PathVariable Long id) {
		return service.recuperarUsuario(id);
	}
}
