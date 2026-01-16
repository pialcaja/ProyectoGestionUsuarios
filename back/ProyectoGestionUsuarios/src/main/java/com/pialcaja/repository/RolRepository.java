package com.pialcaja.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pialcaja.model.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

	@Query("""
			    SELECT r FROM Rol r
			    WHERE UPPER(u.nombre) LIKE UPPER(CONCAT('%', :filtro, '%'))
			""")
	Page<Rol> buscarPorFiltro(@Param("filtro") String filtro, Pageable pageable);	

	Boolean existsByNombreAndIdNot(String nombre, Long id);

	Optional<Rol> findByNombre(String nombre);
}
