# Reservas de Hotel

Proyecto de la asignatura **Programación Aplicada (UNAH)** — API REST desarrollada con Node.js, Express y MySQL.

## Caso Seleccionado
**Reservas de un hotel**
* **Catálogos:** Tipos de habitación (`tipos_habitacion`) y Huéspedes (`huespedes`).
* **Entidad principal:** Habitaciones (`habitaciones`) con estados `libre`, `ocupada`, `limpieza` y `mantenimiento`.
* **Transacción:** Reservaciones (`reservaciones` + `reservacion_habitaciones`) con validación de disponibilidad para impedir fechas traslapadas.

## Integrantes del Equipo
* **Delia Alexandra Oseguera Cubas** — Cuenta: `20212030521` — GitHub: `@Ailed-oseguera`
* **Elsy Marbely Miranda Rivas** — Cuenta: `20212030910` — GitHub: `@emiranda2000`
* **José Leonel Estrada Mendoza** — Cuenta: `20232500012` — GitHub: `@JoLeonel21`

## Entregables Hito 1 (Diseño)
* `database.sql` — Script SQL de creación de la base de datos `hotel_reservas`, tablas, restricciones y datos iniciales.
* `Diagrama-E-R.png` — Diagrama Entidad-Relación exportado desde MySQL Workbench.
* `diseno-api.md` — Tabla de endpoints REST, códigos HTTP y ejemplos JSON.