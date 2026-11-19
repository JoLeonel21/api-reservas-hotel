const pool = require('../db');

async function verificarSalud(req, res) {
  await pool.query('SELECT 1');
  res.json({
    estado: 'ok',
    base_datos: 'conectada',
    fecha: new Date().toISOString()
  });
}

module.exports = { verificarSalud };