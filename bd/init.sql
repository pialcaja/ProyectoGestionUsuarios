-- // CONFIGURACION BD //
create database bd_gestion_usuarios;
use bd_gestion_usuarios;

-- // TABLAS //
create table tb_rol (
	id bigint auto_increment primary key,
    nombre varchar(50) unique not null,
    descripcion varchar(100) default 'Sin descripción'
);

create table tb_usuario (
	id bigint auto_increment primary key,
    nombre varchar(50) not null,
    apepa varchar(50) not null,
    apema varchar(50) not null,
    email varchar(100) unique not null,
    pwd varchar(100) not null,
    fecha_nacimiento date not null,
    id_rol bigint not null,
    estado boolean default true,
    constraint fk_rol_usuario foreign key (id_rol) references tb_rol(id)
);

-- // INDICES //
create index idx_usuario_nombre on tb_usuario(nombre);
create index idx_usuario_apepa on tb_usuario(apepa);
create index idx_usuario_apema on tb_usuario(apema);

-- // INSERTS BASE //
insert into tb_rol(nombre, descripcion) values 
	('ADMIN', 'Usuario administrador de la aplicación'),
	('CLIENTE', 'Usuario cliente de la aplicación');
                                                
insert into tb_usuario(nombre, apepa, apema, email, pwd, fecha_nacimiento, id_rol) values 
	('Piero', 'Caro', 'Jara', 'piero@ejemplo.com', '$2a$10$RjRdnnaldjsLMjBDhlkwSecqNKGs5ZQ6GP882le/3USf3XOQAq82S', '1998-06-30', 1);

