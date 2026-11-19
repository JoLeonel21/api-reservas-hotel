const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validar = require('../middlewares/validar');
const {
  listarHuespedes,
  obtenerHuesped,
  crearHuesped,
  actualizarHuesped,
  eliminarHuesped
} = require('../controladores/huespedes.controlador');

const router = Router();

const validarId = [
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo')
];

const validarFiltros = [
  query('buscar')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El término de búsqueda no debe exceder 100 caracteres')
];

const validarCuerpo = [
  body('identidad')
    .trim()
    .notEmpty()
    .withMessage('La identidad es obligatoria')
    .isLength({ max: 25 })
    .withMessage('La identidad no debe exceder 25 caracteres'),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no debe exceder 100 caracteres'),
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isLength({ max: 20 })
    .withMessage('El teléfono no debe exceder 20 caracteres'),
  body('email')
    .optional({ values: 'null' })
    .trim()
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .isLength({ max: 100 })
    .withMessage('El correo no debe exceder 100 caracteres')
];

router.get('/', validarFiltros, validar, listarHuespedes);
router.get('/:id', validarId, validar, obtenerHuesped);
router.post('/', validarCuerpo, validar, crearHuesped);
router.put('/:id', [...validarId, ...validarCuerpo], validar, actualizarHuesped);
router.delete('/:id', validarId, validar, eliminarHuesped);

module.exports = router;