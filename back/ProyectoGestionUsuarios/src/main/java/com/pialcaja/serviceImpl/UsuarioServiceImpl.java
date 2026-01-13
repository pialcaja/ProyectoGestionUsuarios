package com.pialcaja.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pialcaja.dto.UsuarioListadoResponse;
import com.pialcaja.dto.UsuarioMantenerPorAdminRequest;
import com.pialcaja.model.Usuario;
import com.pialcaja.repository.RolRepository;
import com.pialcaja.repository.UsuarioRepository;
import com.pialcaja.service.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepo;
	
	@Autowired
	private RolRepository rolRepo;
	
	@Override
	public ResponseEntity<Map<String, Object>> listarUsuarios(int page, int size, String filtro, Boolean estado) {
		Map<String, Object> respuesta = new HashMap<>();
		
		Pageable pageable = PageRequest.of(page, size);
		
		Page<Usuario> paginaUsuarios;
		
		if (filtro != null && !filtro.isEmpty()) {
			paginaUsuarios = usuarioRepo.buscarPorFiltro(filtro, estado, pageable);
		} else {
			paginaUsuarios = usuarioRepo.findAll(pageable);
		}
		
		List<UsuarioListadoResponse> usuarios = paginaUsuarios.getContent().stream().map(
				u -> new UsuarioListadoResponse(u.getNombre(), u.getApepa(), u.getApema(), u.getEmail(), u.getRol().getNombre()))
				.toList();
		
		respuesta.put("usuarios", usuarios);
		respuesta.put("totalPaginas", paginaUsuarios.getTotalPages());
		respuesta.put("totalElementos", paginaUsuarios.getTotalElements());
		respuesta.put("paginaActual", paginaUsuarios.getNumber());
		respuesta.put("tamanioPagina", paginaUsuarios.getSize());
		
		return ResponseEntity.status(HttpStatus.OK).body(respuesta);
	}

	@Override
	public ResponseEntity<Map<String, Object>> registrarUsuarioDesdeAdmin(UsuarioMantenerPorAdminRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> listarRoles() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> actualizarUsuarioDesdeAdmin(Long id,
			UsuarioMantenerPorAdminRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> eliminarUsuario(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> recuperarUsuario(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

}
