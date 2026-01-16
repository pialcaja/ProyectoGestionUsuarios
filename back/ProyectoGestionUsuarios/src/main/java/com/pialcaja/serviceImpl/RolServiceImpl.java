package com.pialcaja.serviceImpl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.pialcaja.dto.RolMantenerRequest;
import com.pialcaja.repository.RolRepository;
import com.pialcaja.service.RolService;

@Service
public class RolServiceImpl implements RolService {

	@Autowired
	private RolRepository rolRepo;
	
	@Override
	public ResponseEntity<Map<String, Object>> listarRoles(int page, int size, String filtro) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> registrarRol(RolMantenerRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> obtenerRolPorId(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<Map<String, Object>> actualizarRol(Long id, RolMantenerRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

}
