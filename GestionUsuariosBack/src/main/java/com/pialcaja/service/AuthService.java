package com.pialcaja.service;

import com.pialcaja.dto.AuthResponse;
import com.pialcaja.dto.LoginRequest;

public interface AuthService {

	AuthResponse login(LoginRequest request);
	
	AuthResponse refreshToken(String refreshToken);
}
