package com.pialcaja.security;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.pialcaja.model.Usuario;

public class CustomUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;
	
	@Autowired
	private Usuario usuario;
	
    public CustomUserDetails(Usuario usuario) {
        this.usuario = usuario;
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre()));
	}

	@Override
	public String getPassword() {
		return usuario.getPwd();
	}

	@Override
	public String getUsername() {
		return usuario.getEmail();
	}

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return usuario.getEstado() == true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return usuario.getEstado() == true; }
}
