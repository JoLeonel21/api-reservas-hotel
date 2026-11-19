const { validationResult } = require('express-validator');

function validar(req, res, next) {
  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const detalles = resultado.array().map((err) => ({
      campo: err.path,
      mensaje: err.msg
    }));

    return res.status(400).json({
      error: 'Datos inválidos',
      detalles
    });
  }

  next();
}

module.exports = validar;