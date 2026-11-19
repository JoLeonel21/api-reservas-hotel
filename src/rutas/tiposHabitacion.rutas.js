const { Router } = require('express');
const { body, param } = require('express-validator');
const validar = require('../middlewares/validar');
const {
  listarTiposHabitacion,
  obtenerTipoHabitacion,
  crearTipoHabitacion,
  actualizarTipoHabitacion,
  eliminarTipoHabitacion
} = require('../controladores/tiposHabitacion.controlador');

const router = Router();

const validarId = [
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo')
];

const validarCuerpo = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 60 })
    .withMessage('El nombre no debe exceder 60 caracteres'),
  body('precio_noche')
    .isFloat({ gt: 0 })
    .withMessage('El precio por noche debe ser un número mayor a 0'),
  body('capacidad')
    .isInt({ min: 1, max: 20 })
    .withMessage('La capacidad debe ser un entero entre 1 y 20'),
  body('descripcion')
    .optional({ values: 'null' })
    .isString()
    .withMessage('La descripción debe ser texto')
];

router.get('/', listarTiposHabitacion);
router.get('/:id', validarId, validar, obtenerTipoHabitacion);
router.post('/', validarCuerpo, validar, crearTipoHabitacion);
router.put('/:id', [...validarId, ...validarCuerpo], validar, actualizarTipoHabitacion);
router.delete('/:id', validarId, validar, eliminarTipoHabitacion);

module.exports = router;