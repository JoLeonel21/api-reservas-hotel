const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const saludRutas = require('./rutas/salud.rutas');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/errores');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGEN || '*' }));
app.use(express.json());

app.use('/api/salud', saludRutas);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;