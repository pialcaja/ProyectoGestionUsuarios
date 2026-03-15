package com.pialcaja.service;

import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.pialcaja.dto.RolMantenerRequest;

public interface RolService {

	public ResponseEntity<Map<String, Object>> listarRoles(int page, int size, String filtro);

	public ResponseEntity<Map<String, Object>> registrarRol(RolMantenerRequest request);

	public ResponseEntity<Map<String, Object>> obtenerRolPorId(Long id);

	public ResponseEntity<Map<String, Object>> actualizarRol(Long id, RolMantenerRequest request);
}
