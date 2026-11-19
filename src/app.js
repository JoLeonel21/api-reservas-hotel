const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const saludRutas = require('./rutas/salud.rutas');
const tiposHabitacionRutas = require('./rutas/tiposHabitacion.rutas');
const habitacionesRutas = require('./rutas/habitaciones.rutas');
const huespedesRutas = require('./rutas/huespedes.rutas');
const usuariosRutas = require('./rutas/usuarios.rutas');
const reservacionesRutas = require('./rutas/reservaciones.rutas');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/errores');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGEN || '*' }));
app.use(express.json());

app.use('/api/salud', saludRutas);
app.use('/api/tipos-habitacion', tiposHabitacionRutas);
app.use('/api/habitaciones', habitacionesRutas);
app.use('/api/huespedes', huespedesRutas);
app.use('/api/usuarios', usuariosRutas);
app.use('/api/reservaciones', reservacionesRutas);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;