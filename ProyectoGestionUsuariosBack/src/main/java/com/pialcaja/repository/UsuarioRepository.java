package com.pialcaja.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pialcaja.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	@Query("""
		    SELECT u FROM Usuario u
		    JOIN u.rol r
		    WHERE (
		        LOWER(u.nombre) LIKE LOWER(CONCAT('%', :filtro, '%'))
		        OR LOWER(u.apepa) LIKE LOWER(CONCAT('%', :filtro, '%'))
		        OR LOWER(u.apema) LIKE LOWER(CONCAT('%', :filtro, '%'))
		        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :filtro, '%'))
		        OR LOWER(r.nombre) LIKE LOWER(CONCAT('%', :filtro, '%'))
		    )
		    AND u.estado = :estado
		""")
	Page<Usuario> buscarPorFiltro(@Param("filtro") String filtro, @Param("estado") Boolean estado, Pageable pageable);
	
	Boolean existsByEmail(String email);
	
	Boolean existsByEmailAndIdNot(String email, Long id);
	
	Optional<Usuario> findByEmailIgnoreCase(String email);
	
	Page<Usuario> findByEstado(Boolean estado, Pageable pageable);
}
