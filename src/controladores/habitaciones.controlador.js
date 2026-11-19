const pool = require('../db');

async function listarHabitaciones(req, res) {
  const { estado, tipo_id } = req.query;
  const condiciones = [];
  const parametros = [];

  if (estado) {
    condiciones.push('h.estado = ?');
    parametros.push(estado);
  }
  if (tipo_id) {
    condiciones.push('h.tipo_id = ?');
    parametros.push(tipo_id);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [filas] = await pool.query(
    `SELECT h.*, th.nombre AS tipo_nombre, th.precio_noche, th.capacidad
     FROM habitaciones h
     INNER JOIN tipos_habitacion th ON h.tipo_id = th.id
     ${where}
     ORDER BY h.numero`,
    parametros
  );

  res.json(filas);
}

async function obtenerHabitacion(req, res) {
  const [filas] = await pool.query(
    `SELECT h.*, th.nombre AS tipo_nombre, th.precio_noche, th.capacidad
     FROM habitaciones h
     INNER JOIN tipos_habitacion th ON h.tipo_id = th.id
     WHERE h.id = ?`,
    [req.params.id]
  );

  if (filas.length === 0) {
    return res.status(404).json({ error: 'Habitación no encontrada' });
  }

  res.json(filas[0]);
}

async function crearHabitacion(req, res) {
  const { numero, piso, tipo_id, estado } = req.body;

  const [resultado] = await pool.query(
    `INSERT INTO habitaciones (numero, piso, tipo_id, estado)
     VALUES (?, ?, ?, ?)`,
    [numero, piso, tipo_id, estado ?? 'libre']
  );

  const [filas] = await pool.query(
    `SELECT h.*, th.nombre AS tipo_nombre, th.precio_noche, th.capacidad
     FROM habitaciones h
     INNER JOIN tipos_habitacion th ON h.tipo_id = th.id
     WHERE h.id = ?`,
    [resultado.insertId]
  );

  res.status(201).json(filas[0]);
}

async function actualizarHabitacion(req, res) {
  const { numero, piso, tipo_id, estado } = req.body;

  const [resultado] = await pool.query(
    `UPDATE habitaciones
     SET numero = ?, piso = ?, tipo_id = ?, estado = ?
     WHERE id = ?`,
    [numero, piso, tipo_id, estado ?? 'libre', req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Habitación no encontrada' });
  }

  const [filas] = await pool.query(
    `SELECT h.*, th.nombre AS tipo_nombre, th.precio_noche, th.capacidad
     FROM habitaciones h
     INNER JOIN tipos_habitacion th ON h.tipo_id = th.id
     WHERE h.id = ?`,
    [req.params.id]
  );

  res.json(filas[0]);
}

async function eliminarHabitacion(req, res) {
  const [resultado] = await pool.query(
    'DELETE FROM habitaciones WHERE id = ?',
    [req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Habitación no encontrada' });
  }

  res.status(204).end();
}

module.exports = {
  listarHabitaciones,
  obtenerHabitacion,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
};