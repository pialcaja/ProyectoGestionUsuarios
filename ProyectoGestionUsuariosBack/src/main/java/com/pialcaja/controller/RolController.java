package com.pialcaja.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pialcaja.dto.RolMantenerRequest;
import com.pialcaja.service.RolService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/rol")
@CrossOrigin(origins = "http://localhost:4200")
public class RolController {

	@Autowired
	private RolService service;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> listar(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String filtro
	) {
		return service.listarRoles(page, size, filtro);
	}
	
	@PostMapping
	public ResponseEntity<Map<String, Object>> registrar(@RequestBody RolMantenerRequest request) {
		return service.registrarRol(request);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> obtener(@PathVariable Long id) {
		return service.obtenerRolPorId(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> actualizar(@PathVariable Long id, @RequestBody RolMantenerRequest request) {
		return service.actualizarRol(id, request);
	}
}
