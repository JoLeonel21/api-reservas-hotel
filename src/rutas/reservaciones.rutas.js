const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validar = require('../middlewares/validar');
const {
  listarReservaciones,
  obtenerReservacion,
  crearReservacion,
  actualizarEstadoReservacion
} = require('../controladores/reservaciones.controlador');

const router = Router();

const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'en_curso', 'finalizada', 'cancelada'];

const validarId = [
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo')
];

const validarFiltros = [
  query('estado')
    .optional()
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  query('huesped_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El huesped_id debe ser un entero positivo')
];

const validarCrear = [
  body('huesped_id')
    .isInt({ min: 1 })
    .withMessage('El huesped_id debe ser un entero positivo'),
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario_id debe ser un entero positivo'),
  body('fecha_entrada')
    .isISO8601()
    .withMessage('La fecha_entrada debe tener un formato de fecha válido (ISO 8601)'),
  body('fecha_salida')
    .isISO8601()
    .withMessage('La fecha_salida debe tener un formato de fecha válido (ISO 8601)')
    .custom((fechaSalida, { req }) => {
      if (new Date(fechaSalida) <= new Date(req.body.fecha_entrada)) {
        throw new Error('La fecha_salida debe ser posterior a la fecha_entrada');
      }
      return true;
    }),
  body('estado')
    .optional()
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  body('notas')
    .optional({ values: 'null' })
    .isString()
    .isLength({ max: 255 })
    .withMessage('Las notas no deben exceder 255 caracteres'),
  body('habitaciones')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos una habitación en el arreglo habitaciones'),
  body('habitaciones.*')
    .isInt({ min: 1 })
    .withMessage('Cada ID de habitación debe ser un entero positivo')
];

const validarCambioEstado = [
  body('estado')
    .isIn(ESTADOS_VALIDOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  body('notas')
    .optional({ values: 'null' })
    .isString()
    .isLength({ max: 255 })
    .withMessage('Las notas no deben exceder 255 caracteres')
];

router.get('/', validarFiltros, validar, listarReservaciones);
router.get('/:id', validarId, validar, obtenerReservacion);
router.post('/', validarCrear, validar, crearReservacion);
router.patch('/:id/estado', [...validarId, ...validarCambioEstado], validar, actualizarEstadoReservacion);

module.exports = router;