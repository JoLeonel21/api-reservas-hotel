const pool = require('../db');

async function listarUsuarios(req, res) {
  const [filas] = await pool.query(
    'SELECT id, rol, nombre, email, activo, creado_en FROM usuarios ORDER BY id'
  );
  res.json(filas);
}

async function obtenerUsuario(req, res) {
  const [filas] = await pool.query(
    'SELECT id, rol, nombre, email, activo, creado_en FROM usuarios WHERE id = ?',
    [req.params.id]
  );

  if (filas.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(filas[0]);
}

async function crearUsuario(req, res) {
  const { rol, nombre, email, password_hash, activo } = req.body;

  const [resultado] = await pool.query(
    `INSERT INTO usuarios (rol, nombre, email, password_hash, activo)
     VALUES (?, ?, ?, ?, ?)`,
    [rol ?? 'operador', nombre, email, password_hash, activo ?? true]
  );

  const [filas] = await pool.query(
    'SELECT id, rol, nombre, email, activo, creado_en FROM usuarios WHERE id = ?',
    [resultado.insertId]
  );

  res.status(201).json(filas[0]);
}

async function actualizarUsuario(req, res) {
  const { rol, nombre, email, activo } = req.body;

  const [resultado] = await pool.query(
    `UPDATE usuarios
     SET rol = ?, nombre = ?, email = ?, activo = ?
     WHERE id = ?`,
    [rol ?? 'operador', nombre, email, activo ?? true, req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const [filas] = await pool.query(
    'SELECT id, rol, nombre, email, activo, creado_en FROM usuarios WHERE id = ?',
    [req.params.id]
  );

  res.json(filas[0]);
}

async function eliminarUsuario(req, res) {
  const [resultado] = await pool.query(
    'DELETE FROM usuarios WHERE id = ?',
    [req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.status(204).end();
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};