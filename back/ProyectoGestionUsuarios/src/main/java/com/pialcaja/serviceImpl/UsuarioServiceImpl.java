package com.pialcaja.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pialcaja.dto.UsuarioListadoResponse;
import com.pialcaja.dto.UsuarioMantenerPorAdminRequest;
import com.pialcaja.model.Rol;
import com.pialcaja.model.Usuario;
import com.pialcaja.repository.RolRepository;
import com.pialcaja.repository.UsuarioRepository;
import com.pialcaja.service.UsuarioService;
import com.pialcaja.utils.TextoUtils;

import jakarta.transaction.Transactional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepo;

	@Autowired
	private RolRepository rolRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public ResponseEntity<Map<String, Object>> listarUsuarios(int page, int size, String filtro, Boolean estado) {
		Map<String, Object> respuesta = new HashMap<>();

		try {
			Pageable pageable = PageRequest.of(page, size);

			Page<Usuario> paginaUsuarios;

			if (filtro != null && !filtro.isEmpty()) {
				paginaUsuarios = usuarioRepo.buscarPorFiltro(filtro, estado, pageable);
			} else {
				paginaUsuarios = usuarioRepo.findByEstado(estado, pageable);
			}

			List<UsuarioListadoResponse> usuarios = paginaUsuarios.getContent().stream()
					.map(u -> new UsuarioListadoResponse(u.getId(), u.getNombre(), u.getApepa(), u.getApema(), u.getEmail(),
							u.getRol().getNombre(), u.getEstado()))
					.toList();

			respuesta.put("usuarios", usuarios);
			respuesta.put("totalPaginas", paginaUsuarios.getTotalPages());
			respuesta.put("totalElementos", paginaUsuarios.getTotalElements());
			respuesta.put("paginaActual", paginaUsuarios.getNumber());
			respuesta.put("tamanioPagina", paginaUsuarios.getSize());

			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al listar usuarios: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<Map<String, Object>> registrarUsuarioDesdeAdmin(UsuarioMantenerPorAdminRequest request) {
		Map<String, Object> respuesta = new HashMap<>();

		try {
			validarEmailDuplicado(request.getEmail(), null);

			Usuario usuario = new Usuario();
			usuario.setNombre(TextoUtils.formatoPrimeraLetraMayuscula(request.getNombre()));
			usuario.setApepa(TextoUtils.formatoPrimeraLetraMayuscula(request.getApepa()));
			usuario.setApema(TextoUtils.formatoPrimeraLetraMayuscula(request.getApema()));
			usuario.setEmail(TextoUtils.formatoTodoMinuscula(request.getEmail()));
			usuario.setPwd(passwordEncoder.encode(request.getPwd()));
			usuario.setFecha_nacimiento(request.getFecha_nacimiento());

			Optional<Rol> rolOpt = rolRepo.findById(request.getIdRol());
			if (rolOpt.isEmpty()) {
				respuesta.put("mensaje", "Rol no encontrado");

				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			} else {
				Rol rol = rolOpt.get();

				usuario.setRol(rol);
			}

			usuario.setEstado(true);

			usuarioRepo.save(usuario);

			respuesta.put("mensaje", "Usuario registrado correctamente");
			respuesta.put("usuario", usuario);

			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al registrar usuario: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
		}
	}

	@Override
	public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(Long id) {
		Map<String, Object> respuesta = new HashMap<>();

		try {
			Optional<Usuario> usuarioOpt = usuarioRepo.findById(id);

			if (usuarioOpt.isEmpty()) {
				respuesta.put("mensaje", "Usuario no encontrado");

				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}

			Usuario usuario = usuarioOpt.get();

			respuesta.put("usuario", usuario);

			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al obtener usuario: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<Map<String, Object>> actualizarUsuarioDesdeAdmin(Long id,
			UsuarioMantenerPorAdminRequest request) {
		Map<String, Object> respuesta = new HashMap<>();

		try {
			Optional<Usuario> usuarioOpt = usuarioRepo.findById(id);

			if (usuarioOpt.isEmpty()) {
				respuesta.put("mensaje", "Usuario no encontrado");

				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}

			Usuario usuario = usuarioOpt.get();
			
			if (usuario.getId() == 1) {
				respuesta.put("mensaje", "El usuario principal no puede ser modificado");

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
			}

			validarEmailDuplicado(request.getEmail(), id);

			usuario.setNombre(TextoUtils.formatoPrimeraLetraMayuscula(request.getNombre()));
			usuario.setApepa(TextoUtils.formatoPrimeraLetraMayuscula(request.getApepa()));
			usuario.setApema(TextoUtils.formatoPrimeraLetraMayuscula(request.getApema()));
			usuario.setEmail(TextoUtils.formatoTodoMinuscula(request.getEmail()));

			if (request.getPwd() != null && !request.getPwd().isBlank()) {
				usuario.setPwd(passwordEncoder.encode(request.getPwd()));
			}

			usuario.setFecha_nacimiento(request.getFecha_nacimiento());

			Optional<Rol> rolOpt = rolRepo.findById(request.getIdRol());
			if (rolOpt.isEmpty()) {
				respuesta.put("mensaje", "Rol no encontrado");

				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			} else {
				Rol rol = rolOpt.get();

				usuario.setRol(rol);
			}

			usuarioRepo.save(usuario);

			respuesta.put("mensaje", "Usuario actualizado correctamente");
			respuesta.put("usuario", usuario);

			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al actualizar usuario: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<Map<String, Object>> eliminarUsuario(Long id) {
		Map<String, Object> respuesta = new HashMap<>();

		try {
			Optional<Usuario> usuarioOpt = usuarioRepo.findById(id);

			if (usuarioOpt.isEmpty()) {
				respuesta.put("mensaje", "Usuario no encontrado");

				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}

			Usuario usuario = usuarioOpt.get();
			
			if (usuario.getId() == 1) {
				respuesta.put("mensaje", "El usuario principal no puede ser eliminado");

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
			}

			if (usuario.getEstado() == false) {
				respuesta.put("mensaje", "Usuario actualmente eliminado");

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
			} else {
				usuario.setEstado(false);
			}

			usuarioRepo.save(usuario);

			respuesta.put("mensaje", "Usuario eliminado correctamente");

			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al eliminar usuario: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<Map<String, Object>> recuperarUsuario(Long id) {
		Map<String, Object> respuesta = new HashMap<>();

		try {
			Optional<Usuario> usuarioOpt = usuarioRepo.findById(id);

			if (usuarioOpt.isEmpty()) {
				respuesta.put("mensaje", "Usuario no encontrado");

				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}

			Usuario usuario = usuarioOpt.get();
			
			if (usuario.getId() == 1) {
				respuesta.put("mensaje", "El usuario principal no puede ser recuperado");

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
			}

			if (usuario.getEstado() == true) {
				respuesta.put("mensaje", "Usuario actualmente eliminado");

				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
			} else {
				usuario.setEstado(true);
			}

			usuarioRepo.save(usuario);

			respuesta.put("mensaje", "Usuario recuperado correctamente");

			return ResponseEntity.status(HttpStatus.OK).body(respuesta);
		} catch (Exception e) {
			respuesta.put("mensaje", "Error al recuperar usuario: " + e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
		}
	}

	@Override
	public ResponseEntity<List<Map<String, Object>>> listarRoles() {
		List<Map<String, Object>> roles = rolRepo.findAll().stream().map(rol -> {
			Map<String, Object> map = new HashMap<>();
			map.put("id", rol.getId());
			map.put("nombre", rol.getNombre());
			return map;
		}).collect(Collectors.toList());

		return ResponseEntity.status(HttpStatus.OK).body(roles);
	}

	private void validarEmailDuplicado(String email, Long idExcluido) {
		email = TextoUtils.formatoTodoMinuscula(email);

		Boolean existeEmail = (idExcluido == null) ? usuarioRepo.existsByEmail(email)
				: usuarioRepo.existsByEmailAndIdNot(email, idExcluido);

		if (existeEmail) {
			throw new RuntimeException("Email ya enlazado a otro usuario");
		}
	}
}
