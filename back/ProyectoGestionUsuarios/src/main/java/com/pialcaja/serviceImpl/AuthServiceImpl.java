package com.pialcaja.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.pialcaja.dto.AuthResponse;
import com.pialcaja.dto.LoginRequest;
import com.pialcaja.model.Usuario;
import com.pialcaja.repository.UsuarioRepository;
import com.pialcaja.security.CustomUserDetailsService;
import com.pialcaja.service.AuthService;
import com.pialcaja.utils.JwtUtils;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private UsuarioRepository usuarioRepo;
	
	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private CustomUserDetailsService userDetailsService;
	
	@Override
	public AuthResponse login(LoginRequest request) {
		
		Authentication auth = authManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPwd()));
		
		UserDetails details = (UserDetails) auth.getPrincipal();
		
		Usuario usuario = usuarioRepo.findByEmailIgnoreCase(details.getUsername()).get();
		
		return new AuthResponse(jwtUtils.generateToken(details), jwtUtils.generateRefreshToken(details),
				usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().getNombre());
	}

	@Override
	public AuthResponse refreshToken(String refreshToken) {

		String email = jwtUtils.extractUsername(refreshToken);
		
		UserDetails userDetails = userDetailsService.loadUserByUsername(email);
		
		if (!jwtUtils.isTokenValid(refreshToken, userDetails)) {
			throw new RuntimeException("Refresh token inválido");
		}
		
		Usuario usuario = usuarioRepo.findByEmailIgnoreCase(email).get();
		
		return new AuthResponse(jwtUtils.generateToken(userDetails), jwtUtils.generateRefreshToken(userDetails),
				usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().getNombre());
	}

}
