const pool = require('../db');

function calcularNoches(fechaEntrada, fechaSalida) {
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const diferenciaMs = salida.getTime() - entrada.getTime();
  return Math.max(1, Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)));
}

async function obtenerDetalleReservacion(conexion, id) {
  const [reservaciones] = await conexion.query(
    `SELECT r.*,
            hu.nombre AS huesped_nombre,
            hu.identidad AS huesped_identidad,
            u.nombre AS usuario_nombre
     FROM reservaciones r
     INNER JOIN huespedes hu ON r.huesped_id = hu.id
     INNER JOIN usuarios u ON r.usuario_id = u.id
     WHERE r.id = ?`,
    [id]
  );

  if (reservaciones.length === 0) return null;

  const [habitaciones] = await conexion.query(
    `SELECT rh.id,
            rh.habitacion_id,
            h.numero,
            h.piso,
            th.nombre AS tipo_nombre,
            rh.precio_aplicado
     FROM reservacion_habitaciones rh
     INNER JOIN habitaciones h ON rh.habitacion_id = h.id
     INNER JOIN tipos_habitacion th ON h.tipo_id = th.id
     WHERE rh.reservacion_id = ?
     ORDER BY h.numero`,
    [id]
  );

  return {
    ...reservaciones[0],
    habitaciones
  };
}

async function listarReservaciones(req, res) {
  const { estado, huesped_id } = req.query;
  const condiciones = [];
  const parametros = [];

  if (estado) {
    condiciones.push('r.estado = ?');
    parametros.push(estado);
  }
  if (huesped_id) {
    condiciones.push('r.huesped_id = ?');
    parametros.push(huesped_id);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [filas] = await pool.query(
    `SELECT r.*,
            hu.nombre AS huesped_nombre,
            hu.identidad AS huesped_identidad,
            u.nombre AS usuario_nombre
     FROM reservaciones r
     INNER JOIN huespedes hu ON r.huesped_id = hu.id
     INNER JOIN usuarios u ON r.usuario_id = u.id
     ${where}
     ORDER BY r.id DESC`,
    parametros
  );

  res.json(filas);
}

async function obtenerReservacion(req, res) {
  const reservacion = await obtenerDetalleReservacion(pool, req.params.id);

  if (!reservacion) {
    return res.status(404).json({ error: 'Reservación no encontrada' });
  }

  res.json(reservacion);
}

async function crearReservacion(req, res) {
  const {
    huesped_id,
    usuario_id,
    fecha_entrada,
    fecha_salida,
    estado,
    notas,
    habitaciones
  } = req.body;

  const estadoInicial = estado ?? 'confirmada';
  const habitacionesUnicas = [...new Set(habitaciones.map(Number))];
  const noches = calcularNoches(fecha_entrada, fecha_salida);

  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [huespedes] = await conexion.query(
      'SELECT id FROM huespedes WHERE id = ?',
      [huesped_id]
    );
    if (huespedes.length === 0) {
      await conexion.rollback();
      return res.status(404).json({ error: 'Huésped no encontrado' });
    }

    const [usuarios] = await conexion.query(
      'SELECT id FROM usuarios WHERE id = ? AND activo = TRUE',
      [usuario_id]
    );
    if (usuarios.length === 0) {
      await conexion.rollback();
      return res.status(404).json({ error: 'Usuario no encontrado o inactivo' });
    }

    const placeholders = habitacionesUnicas.map(() => '?').join(', ');
    const [datosHabitaciones] = await conexion.query(
      `SELECT h.id, h.numero, h.estado, th.precio_noche
       FROM habitaciones h
       INNER JOIN tipos_habitacion th ON h.tipo_id = th.id
       WHERE h.id IN (${placeholders})
       FOR UPDATE`,
      habitacionesUnicas
    );

    if (datosHabitaciones.length !== habitacionesUnicas.length) {
      await conexion.rollback();
      return res.status(404).json({ error: 'Una o más habitaciones no existen' });
    }

    const noDisponibles = datosHabitaciones.filter((h) => h.estado === 'mantenimiento');
    if (noDisponibles.length > 0) {
      await conexion.rollback();
      return res.status(409).json({
        error: `Habitación(es) en mantenimiento: ${noDisponibles.map((h) => h.numero).join(', ')}`
      });
    }

    const [traslapes] = await conexion.query(
      `SELECT DISTINCT h.numero
       FROM reservacion_habitaciones rh
       INNER JOIN reservaciones r ON rh.reservacion_id = r.id
       INNER JOIN habitaciones h ON rh.habitacion_id = h.id
       WHERE rh.habitacion_id IN (${placeholders})
         AND r.estado IN ('pendiente', 'confirmada', 'en_curso')
         AND r.fecha_entrada < ?
         AND r.fecha_salida > ?`,
      [...habitacionesUnicas, fecha_salida, fecha_entrada]
    );

    if (traslapes.length > 0) {
      await conexion.rollback();
      return res.status(409).json({
        error: `Habitación(es) ya reservada(s) en esas fechas: ${traslapes.map((t) => t.numero).join(', ')}`
      });
    }

    const total = datosHabitaciones.reduce(
      (acum, h) => acum + Number(h.precio_noche) * noches,
      0
    );

    const [resultadoReserva] = await conexion.query(
      `INSERT INTO reservaciones (huesped_id, usuario_id, fecha_entrada, fecha_salida, estado, total, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [huesped_id, usuario_id, fecha_entrada, fecha_salida, estadoInicial, total, notas ?? null]
    );

    const reservacionId = resultadoReserva.insertId;

    for (const hab of datosHabitaciones) {
      await conexion.query(
        `INSERT INTO reservacion_habitaciones (reservacion_id, habitacion_id, precio_aplicado)
         VALUES (?, ?, ?)`,
        [reservacionId, hab.id, hab.precio_noche]
      );
    }

    if (estadoInicial === 'en_curso') {
      await conexion.query(
        `UPDATE habitaciones SET estado = 'ocupada' WHERE id IN (${placeholders})`,
        habitacionesUnicas
      );
    }

    await conexion.commit();

    const reservacionCreada = await obtenerDetalleReservacion(pool, reservacionId);
    res.status(201).json(reservacionCreada);
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

async function actualizarEstadoReservacion(req, res) {
  const { estado, notas } = req.body;
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [reservaciones] = await conexion.query(
      'SELECT * FROM reservaciones WHERE id = ? FOR UPDATE',
      [req.params.id]
    );

    if (reservaciones.length === 0) {
      await conexion.rollback();
      return res.status(404).json({ error: 'Reservación no encontrada' });
    }

    const reservaActual = reservaciones[0];

    if (reservaActual.estado === 'finalizada' || reservaActual.estado === 'cancelada') {
      await conexion.rollback();
      return res.status(409).json({
        error: `No se puede modificar una reservación en estado "${reservaActual.estado}"`
      });
    }

    await conexion.query(
      `UPDATE reservaciones
       SET estado = ?, notas = COALESCE(?, notas)
       WHERE id = ?`,
      [estado, notas ?? null, req.params.id]
    );

    const [detalles] = await conexion.query(
      'SELECT habitacion_id FROM reservacion_habitaciones WHERE reservacion_id = ?',
      [req.params.id]
    );

    if (detalles.length > 0) {
      const idsHabitaciones = detalles.map((d) => d.habitacion_id);
      const placeholders = idsHabitaciones.map(() => '?').join(', ');

      if (estado === 'en_curso') {
        await conexion.query(
          `UPDATE habitaciones SET estado = 'ocupada' WHERE id IN (${placeholders})`,
          idsHabitaciones
        );
      } else if (estado === 'finalizada') {
        await conexion.query(
          `UPDATE habitaciones SET estado = 'limpieza' WHERE id IN (${placeholders})`,
          idsHabitaciones
        );
      } else if (estado === 'cancelada') {
        await conexion.query(
          `UPDATE habitaciones SET estado = 'libre' WHERE id IN (${placeholders})`,
          idsHabitaciones
        );
      }
    }

    await conexion.commit();

    const reservacionActualizada = await obtenerDetalleReservacion(pool, req.params.id);
    res.json(reservacionActualizada);
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

module.exports = {
  listarReservaciones,
  obtenerReservacion,
  crearReservacion,
  actualizarEstadoReservacion
};