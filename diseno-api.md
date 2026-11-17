# Diseño de API - Reservas de un Hotel

**Equipo:** Delia Alexandra Oseguera Cubas, Elsy Marbely Miranda Rivas, José Leonel Estrada Mendoza

## 1. Recursos y campos

### Recurso: usuarios
| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| id | entero | generado | 1 |
| rol | texto | sí | operador |
| nombre | texto | sí | Administrador Hotel |
| email | texto | sí | admin@hotel.hn |
| password_hash | texto | sí | ******** |
| activo | booleano | generado | true |

### Recurso: tipos_habitacion
| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| id | entero | generado | 1 |
| nombre | texto | sí | Sencilla |
| descripcion | texto | no | Cama matrimonial, aire acondicionado, TV y Wi-Fi |
| capacidad | entero | sí | 2 |
| precio_noche | decimal | sí | 1200.00 |

### Recurso: huespedes
| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| id | entero | generado | 1 |
| identidad | texto | sí | 0801-2024-12345 |
| nombre | texto | sí | Delia Alexandra Oseguera Cubas |
| telefono | texto | sí | 9865-0281 |
| email | texto | no | DeliaAOseguera@gmail.com |

### Recurso: habitaciones
| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| id | entero | generado | 1 |
| numero | texto | sí | 101 |
| piso | entero | sí | 1 |
| tipo_id | entero | sí | 1 |
| estado | texto | generado | libre |

### Recurso: reservaciones
| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| id | entero | generado | 1 |
| huesped_id | entero | sí | 1 |
| usuario_id | entero | sí | 2 |
| fecha_entrada | fecha-hora | sí | 2026-11-20 15:00:00 |
| fecha_salida | fecha-hora | sí | 2026-11-23 12:00:00 |
| estado | texto | generado | confirmada |
| total | decimal | generado | 3600.00 |
| notas | texto | no | Llegada por la tarde |
| habitaciones | arreglo | sí | [1, 3] |

### Recurso: reservacion_habitaciones
| Campo | Tipo | Obligatorio | Ejemplo |
|---|---|---|---|
| id | entero | generado | 1 |
| reservacion_id | entero | sí | 1 |
| habitacion_id | entero | sí | 1 |
| precio_aplicado | decimal | sí | 1200.00 |

## 2. Tabla de rutas

| Método | Ruta | Acción | Respuestas |
|---|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión | 200, 400, 401 |
| POST | `/api/auth/registro` | Registrar usuario | 201, 400, 403 |
| GET | `/api/tipos-habitacion` | Listar tipos de habitación | 200 |
| GET | `/api/tipos-habitacion/:id` | Ver un tipo de habitación | 200, 404 |
| POST | `/api/tipos-habitacion` | Crear tipo de habitación | 201, 400 |
| PUT | `/api/tipos-habitacion/:id` | Reemplazar tipo de habitación | 200, 400, 404 |
| DELETE | `/api/tipos-habitacion/:id` | Eliminar tipo de habitación | 204, 404, 409 |
| GET | `/api/huespedes` | Listar huéspedes | 200 |
| GET | `/api/huespedes/:id` | Ver un huésped | 200, 404 |
| POST | `/api/huespedes` | Crear huésped | 201, 400, 409 |
| PUT | `/api/huespedes/:id` | Reemplazar huésped | 200, 400, 404 |
| DELETE | `/api/huespedes/:id` | Eliminar huésped | 204, 404, 409 |
| GET | `/api/habitaciones` | Listar habitaciones | 200 |
| GET | `/api/habitaciones?estado=libre` | Filtrar habitaciones por estado | 200 |
| GET | `/api/habitaciones/:id` | Ver una habitación | 200, 404 |
| POST | `/api/habitaciones` | Crear habitación | 201, 400, 409 |
| PUT | `/api/habitaciones/:id` | Reemplazar habitación | 200, 400, 404 |
| PATCH | `/api/habitaciones/:id/estado` | Cambiar estado (`libre`, `ocupada`, `limpieza`, `mantenimiento`) | 200, 400, 404 |
| DELETE | `/api/habitaciones/:id` | Eliminar habitación | 204, 404, 409 |
| GET | `/api/reservaciones` | Listar reservaciones | 200 |
| GET | `/api/reservaciones/:id` | Ver una reservación con su detalle | 200, 404 |
| GET | `/api/reservaciones/:id/habitaciones` | Ver habitaciones de una reservación | 200, 404 |
| POST | `/api/reservaciones` | Crear reservación con habitaciones (transacción) | 201, 400, 409 |
| PATCH | `/api/reservaciones/:id/estado` | Cambiar estado de la reservación | 200, 400, 404 |

## 3. Ejemplos JSON

**POST /api/reservaciones**

Petición:

```json
{
  "huesped_id": 1,
  "fecha_entrada": "2026-11-20 15:00:00",
  "fecha_salida": "2026-11-23 12:00:00",
  "notas": "Llegada después de las 3:00 PM",
  "habitaciones": [1, 3]
}
```

Respuesta `201`:

```json
{
  "id": 2,
  "huesped_id": 1,
  "usuario_id": 2,
  "fecha_entrada": "2026-11-20 15:00:00",
  "fecha_salida": "2026-11-23 12:00:00",
  "estado": "confirmada",
  "total": 9150.00,
  "habitaciones": [
    { "habitacion_id": 1, "precio_aplicado": 1200.00 },
    { "habitacion_id": 3, "precio_aplicado": 1850.00 }
  ]
}
```

Respuesta `400`:

```json
{ "error": "La fecha de salida debe ser mayor a la fecha de enrada" }
```