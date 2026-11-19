-- PROYECTO: Reservas de Hotel
-- H1: Diseño
-- Delia Alexandra oseguera Cubas   20212030521
-- Elsy Marbely Miranda Rivas 20212030910
-- José Leonel Estrada Mendoza 20232500012

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS hotel_reservas;
CREATE DATABASE hotel_reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_reservas;

CREATE TABLE usuarios (
    rol ENUM('admin', 'operador') NOT NULL DEFAULT 'operador',
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tipos_habitacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    capacidad INT NOT NULL DEFAULT 2,
    precio_noche DECIMAL(10, 2) NOT NULL
);

CREATE TABLE huespedes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identidad VARCHAR(25) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL UNIQUE,
    piso INT NOT NULL,
    tipo_id INT NOT NULL,
    estado ENUM('libre', 'ocupada', 'limpieza', 'mantenimiento') NOT NULL DEFAULT 'libre',
    CONSTRAINT fk_habitacion_tipo FOREIGN KEY (tipo_id) 
        REFERENCES tipos_habitacion(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE reservaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    huesped_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_entrada DATETIME NOT NULL,
    fecha_salida DATETIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'en_curso', 'finalizada', 'cancelada') NOT NULL DEFAULT 'confirmada',
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notas VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_huesped FOREIGN KEY (huesped_id) 
        REFERENCES huespedes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_fechas CHECK (fecha_salida > fecha_entrada)
);

CREATE TABLE reservacion_habitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservacion_id INT NOT NULL,
    habitacion_id INT NOT NULL,
    precio_aplicado DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_det_reservacion FOREIGN KEY (reservacion_id) 
        REFERENCES reservaciones(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_det_habitacion FOREIGN KEY (habitacion_id) 
        REFERENCES habitaciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_reserva_habitacion UNIQUE (reservacion_id, habitacion_id)
);


INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Administrador Hotel', 'admin@hotel.hn', '$2b$10$hashDeEjemploAdmin123456789', 'admin'),
('Recepcionista Turno Día', 'recepcion@hotel.hn', '$2b$10$hashDeEjemploOper123456789', 'operador');

INSERT INTO tipos_habitacion (nombre, descripcion, capacidad, precio_noche) VALUES
('Sencilla', 'Cama matrimonial, aire acondicionado, TV y Wi-Fi', 2, 1200.00),
('Doble', 'Dos camas matrimoniales, ideal para familias o compañeros', 4, 1850.00),
('Suite Ejecutiva', 'Cama King, sala de estar, minibar y vista panorámica', 2, 3200.00);

INSERT INTO huespedes (identidad, nombre, telefono, email) VALUES
('0801-2024-12345', 'Delia Alexandra Oseguera Cubas', '9865-0281', 'DeliaAOseguera@gmail.com'),
('0501-2005-54321', 'Elsy Marbely Miranda Rivas', '9561-9230', 'Elsy.MRivas@gmail.com'),
('0704-2003-12345', 'José Leonel Estrada', '9789-8599', 'JLEstrada@gmail.com');

INSERT INTO habitaciones (numero, piso, tipo_id, estado) VALUES
('101', 1, 1, 'libre'),
('102', 1, 1, 'ocupada'),
('201', 2, 2, 'libre'),
('202', 2, 2, 'limpieza'),
('301', 3, 3, 'libre');

-- Reservación de prueba (Habitación 102 ocupada por 2 noches = 2400.00)
INSERT INTO reservaciones (huesped_id, usuario_id, fecha_entrada, fecha_salida, estado, total, notas) VALUES
(1, 2, '2026-11-16 15:00:00', '2026-11-18 12:00:00', 'en_curso', 2400.00, 'Solicita almohadas extra');

INSERT INTO reservacion_habitaciones (reservacion_id, habitacion_id, precio_aplicado) VALUES
(1, 2, 1200.00);

USE hotel_reservas;

SELECT * FROM usuarios;
SELECT * FROM tipos_habitacion;
SELECT * FROM huespedes;
SELECT * FROM habitaciones;
SELECT * FROM reservaciones;
SELECT * FROM reservacion_habitaciones;