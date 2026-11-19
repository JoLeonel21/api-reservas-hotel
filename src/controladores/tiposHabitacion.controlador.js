const pool = require('../db');

async function listarTiposHabitacion(req, res) {
  const [filas] = await pool.query(
    'SELECT * FROM tipos_habitacion ORDER BY id'
  );
  res.json(filas);
}

async function obtenerTipoHabitacion(req, res) {
  const [filas] = await pool.query(
    'SELECT * FROM tipos_habitacion WHERE id = ?',
    [req.params.id]
  );

  if (filas.length === 0) {
    return res.status(404).json({ error: 'Tipo de habitación no encontrado' });
  }

  res.json(filas[0]);
}

async function crearTipoHabitacion(req, res) {
  const { nombre, precio_noche, capacidad, descripcion } = req.body;

  const [resultado] = await pool.query(
    `INSERT INTO tipos_habitacion (nombre, precio_noche, capacidad, descripcion)
     VALUES (?, ?, ?, ?)`,
    [nombre, precio_noche, capacidad, descripcion ?? null]
  );

  const [filas] = await pool.query(
    'SELECT * FROM tipos_habitacion WHERE id = ?',
    [resultado.insertId]
  );

  res.status(201).json(filas[0]);
}

async function actualizarTipoHabitacion(req, res) {
  const { nombre, precio_noche, capacidad, descripcion } = req.body;

  const [resultado] = await pool.query(
    `UPDATE tipos_habitacion
     SET nombre = ?, precio_noche = ?, capacidad = ?, descripcion = ?
     WHERE id = ?`,
    [nombre, precio_noche, capacidad, descripcion ?? null, req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Tipo de habitación no encontrado' });
  }

  const [filas] = await pool.query(
    'SELECT * FROM tipos_habitacion WHERE id = ?',
    [req.params.id]
  );

  res.json(filas[0]);
}

async function eliminarTipoHabitacion(req, res) {
  const [resultado] = await pool.query(
    'DELETE FROM tipos_habitacion WHERE id = ?',
    [req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Tipo de habitación no encontrado' });
  }

  res.status(204).end();
}

module.exports = {
  listarTiposHabitacion,
  obtenerTipoHabitacion,
  crearTipoHabitacion,
  actualizarTipoHabitacion,
  eliminarTipoHabitacion
};