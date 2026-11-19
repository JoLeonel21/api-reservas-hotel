const pool = require('../db');

async function listarHuespedes(req, res) {
  const { buscar } = req.query;
  const condiciones = [];
  const parametros = [];

  if (buscar) {
    condiciones.push('(nombre LIKE ? OR identidad LIKE ? OR email LIKE ?)');
    const termino = `%${buscar}%`;
    parametros.push(termino, termino, termino);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [filas] = await pool.query(
    `SELECT * FROM huespedes ${where} ORDER BY id`,
    parametros
  );

  res.json(filas);
}

async function obtenerHuesped(req, res) {
  const [filas] = await pool.query(
    'SELECT * FROM huespedes WHERE id = ?',
    [req.params.id]
  );

  if (filas.length === 0) {
    return res.status(404).json({ error: 'Huésped no encontrado' });
  }

  res.json(filas[0]);
}

async function crearHuesped(req, res) {
  const { identidad, nombre, telefono, email } = req.body;

  const [resultado] = await pool.query(
    `INSERT INTO huespedes (identidad, nombre, telefono, email)
     VALUES (?, ?, ?, ?)`,
    [identidad, nombre, telefono, email ?? null]
  );

  const [filas] = await pool.query(
    'SELECT * FROM huespedes WHERE id = ?',
    [resultado.insertId]
  );

  res.status(201).json(filas[0]);
}

async function actualizarHuesped(req, res) {
  const { identidad, nombre, telefono, email } = req.body;

  const [resultado] = await pool.query(
    `UPDATE huespedes
     SET identidad = ?, nombre = ?, telefono = ?, email = ?
     WHERE id = ?`,
    [identidad, nombre, telefono, email ?? null, req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Huésped no encontrado' });
  }

  const [filas] = await pool.query(
    'SELECT * FROM huespedes WHERE id = ?',
    [req.params.id]
  );

  res.json(filas[0]);
}

async function eliminarHuesped(req, res) {
  const [resultado] = await pool.query(
    'DELETE FROM huespedes WHERE id = ?',
    [req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Huésped no encontrado' });
  }

  res.status(204).end();
}

module.exports = {
  listarHuespedes,
  obtenerHuesped,
  crearHuesped,
  actualizarHuesped,
  eliminarHuesped
};