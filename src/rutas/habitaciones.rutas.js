const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validar = require('../middlewares/validar');
const {
  listarHabitaciones,
  obtenerHabitacion,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
} = require('../controladores/habitaciones.controlador');

const router = Router();

const ESTADOS_VALIDOS = ['libre', 'ocupada', 'limpieza', 'mantenimiento'];

const validarId = [
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo')
];

const validarFiltros = [
  query('estado')
    .optional()
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  query('tipo_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El tipo_id debe ser un entero positivo')
];

const validarCuerpo = [
  body('numero')
    .trim()
    .notEmpty()
    .withMessage('El número de habitación es obligatorio')
    .isLength({ max: 10 })
    .withMessage('El número no debe exceder 10 caracteres'),
  body('piso')
    .isInt({ min: 1, max: 100 })
    .withMessage('El piso debe ser un entero entre 1 y 100'),
  body('tipo_id')
    .isInt({ min: 1 })
    .withMessage('El tipo_id debe ser un entero positivo'),
  body('estado')
    .optional()
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`)
];

router.get('/', validarFiltros, validar, listarHabitaciones);
router.get('/:id', validarId, validar, obtenerHabitacion);
router.post('/', validarCuerpo, validar, crearHabitacion);
router.put('/:id', [...validarId, ...validarCuerpo], validar, actualizarHabitacion);
router.delete('/:id', validarId, validar, eliminarHabitacion);

module.exports = router;