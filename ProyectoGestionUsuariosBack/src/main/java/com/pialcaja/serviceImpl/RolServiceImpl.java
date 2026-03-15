package com.pialcaja.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pialcaja.dto.RolListadoResponse;
import com.pialcaja.dto.RolMantenerRequest;
import com.pialcaja.model.Rol;
import com.pialcaja.repository.RolRepository;
import com.pialcaja.service.RolService;
import com.pialcaja.utils.TextoUtils;

import jakarta.transaction.Transactional;

@Service
public class RolServiceImpl implements RolService {

	@Autowired
	private RolRepository rolRepo;
	
	@Override
	public ResponseEntity<Map<String, Object>> listarRoles(int page, int size, String filtro) {
		Map<String, Object> respuesta = new HashMap<>();
		
		try {
			Pageable pageable = PageRequest.of(page, size);
			
			Page<Rol> paginaRoles;
			
			if (filtro != null && !filtro.isEmpty()) {
				paginaRoles = rolRepo.buscarPorFiltro(filtro, pageable);
			} else {
				paginaRoles = rolRepo.findAll(pageable);
			}
			
			List<RolListadoResponse> roles = paginaRoles.getContent().stream()
					.map(r -> new RolListadoResponse(r.getId(), r.getNombre()))
					.toList();
			
			respuesta.put("roles", roles);
			respuesta.put("totalPaginas", paginaRoles.getTotalPages());
			respuesta.put("totalElementos", paginaRoles.getTotalElements());
			respuesta.put("paginaActual", paginaRoles.getNumber());
			respuesta.put("tamanioPagina", paginaRoles.getSize());
			
			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al listar roles: " + e.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<Map<String, Object>> registrarRol(RolMantenerRequest request) {
		Map<String, Object> respuesta = new HashMap<>();
		
		try {
			validarNombreDuplicado(request.getNombre(), null);
			
			Rol rol = new Rol();
			rol.setNombre(TextoUtils.formatoTodoMayuscula(request.getNombre()));
			
			if (request.getDescripcion().trim().isBlank() || request.getDescripcion().trim().isEmpty()) {
				rol.setDescripcion("Sin descripción");
			} else {
				rol.setDescripcion(TextoUtils.formatoPrimeraLetraMayuscula(request.getDescripcion()));
			}
			
			rolRepo.save(rol);
			
			respuesta.put("mensaje", "Rol registrado correctamente");
			respuesta.put("rol", rol);
			
			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al registrar rol: " + e.getMessage());
			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
		}
	}

	@Override
	public ResponseEntity<Map<String, Object>> obtenerRolPorId(Long id) {
		Map<String, Object> respuesta = new HashMap<>();
		
		try {
			Optional<Rol> rolOpt = rolRepo.findById(id);
			
			if (rolOpt.isEmpty()) {
				respuesta.put("mensaje", "Rol no encontrado");
				
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}
			
			Rol rol = rolOpt.get();
			
			respuesta.put("rol", rol);
			
			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al obtener rol: " + e.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<Map<String, Object>> actualizarRol(Long id, RolMantenerRequest request) {
		Map<String, Object> respuesta = new HashMap<>();
		
		try {
			Optional<Rol> rolOpt = rolRepo.findById(id);
			
			if (rolOpt.isEmpty()) {
				respuesta.put("mensaje", "Rol no encontrado");
				
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}
			
			Rol rol = rolOpt.get();
			
			if (rol.getId() == 1) {
				respuesta.put("mensaje", "El rol principal no puede ser modificado");
				
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
			}
			
			validarNombreDuplicado(request.getNombre(), id);
			
			rol.setNombre(TextoUtils.formatoTodoMayuscula(request.getNombre()));
			
			if (request.getDescripcion().trim().isBlank() || request.getDescripcion().trim().isEmpty()) {
				rol.setDescripcion("Sin descripción");
			} else {
				rol.setDescripcion(TextoUtils.formatoPrimeraLetraMayuscula(request.getDescripcion()));
			}
			
			rolRepo.save(rol);
			
			respuesta.put("mensaje", "Rol actualizado correctamente");
			respuesta.put("rol", rol);
			
			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al actualizar rol: " + e.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	private void validarNombreDuplicado(String nombre, Long idExcluido) {
		nombre = TextoUtils.formatoTodoMayuscula(nombre);
		
		Boolean existeNombre = (idExcluido == null) ? rolRepo.existsByNombre(nombre)
				: rolRepo.existsByNombreAndIdNot(nombre, idExcluido);
		
		if (existeNombre) {
			throw new RuntimeException("Nombre de rol ya enlazado a otro usuario");
		}
	}
}
