package com.pialcaja.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.pialcaja.dto.UsuarioActualizarRequest;
import com.pialcaja.dto.UsuarioMantenerPorAdminRequest;

public interface UsuarioService {

	public ResponseEntity<Map<String, Object>> listarUsuarios(int page, int size, String filtro, Boolean estado);
	
	public ResponseEntity<Map<String, Object>> registrarUsuarioDesdeAdmin(UsuarioMantenerPorAdminRequest request);
	
	public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(Long id);
	
	public ResponseEntity<Map<String, Object>> actualizarUsuarioDesdeAdmin(Long id, UsuarioMantenerPorAdminRequest request);
	
	public ResponseEntity<Map<String, Object>> eliminarUsuario(Long id);
	
	public ResponseEntity<Map<String, Object>> recuperarUsuario(Long id);

	public ResponseEntity<List<Map<String, Object>>> listarRoles();

	public ResponseEntity<Map<String, Object>> actualizarMiPerfil(UsuarioActualizarRequest request);
	
	public ResponseEntity<Map<String, Object>> obtenerMiPerfil();
}
