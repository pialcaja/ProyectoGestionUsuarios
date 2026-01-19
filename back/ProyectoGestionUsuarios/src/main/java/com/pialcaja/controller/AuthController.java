package com.pialcaja.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pialcaja.dto.AuthResponse;
import com.pialcaja.dto.LoginRequest;
import com.pialcaja.dto.RefreshTokenRequest;
import com.pialcaja.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

	@Autowired
	private AuthService authService;
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {	
		return ResponseEntity.status(HttpStatus.OK).body(authService.login(request));
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
		return ResponseEntity.status(HttpStatus.OK).body(authService.refreshToken(request.getRefreshToken()));
	}
	
}
