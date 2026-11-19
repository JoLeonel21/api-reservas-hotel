const { Router } = require('express');
const { verificarSalud } = require('../controladores/salud.controlador');

const router = Router();
router.get('/', verificarSalud);

module.exports = router;