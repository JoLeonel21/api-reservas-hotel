const { Router } = require('express');
const { body, param } = require('express-validator');
const validar = require('../middlewares/validar');
const {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controladores/usuarios.controlador');

const router = Router();

const ROLES_VALIDOS = ['admin', 'operador'];

const validarId = [
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo')
];

const validarCrear = [
  body('rol')
    .optional()
    .isIn(ROLES_VALIDOS)
    .withMessage(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no debe exceder 100 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .isLength({ max: 100 })
    .withMessage('El correo no debe exceder 100 caracteres'),
  body('password_hash')
    .trim()
    .notEmpty()
    .withMessage('La contraseña (hash) es obligatoria')
    .isLength({ max: 255 })
    .withMessage('La contraseña no debe exceder 255 caracteres'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
];

const validarActualizar = [
  body('rol')
    .optional()
    .isIn(ROLES_VALIDOS)
    .withMessage(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no debe exceder 100 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .isLength({ max: 100 })
    .withMessage('El correo no debe exceder 100 caracteres'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
];

router.get('/', listarUsuarios);
router.get('/:id', validarId, validar, obtenerUsuario);
router.post('/', validarCrear, validar, crearUsuario);
router.put('/:id', [...validarId, ...validarActualizar], validar, actualizarUsuario);
router.delete('/:id', validarId, validar, eliminarUsuario);

module.exports = router;