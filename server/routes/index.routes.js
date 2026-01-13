import express from 'express';
import operativoRutas from './operativo.routes.js';
import detalleRutas from './detalle.routes.js';
import logsRutas from './logs.routes.js';
import elementoRutas from './elemento.routes.js';
import tipoOperativoRutas from './tipoOperativo.routes.js';
import puestoRutas from './puesto.routes.js';


const router = express.Router();
router.use('/operativo', operativoRutas);
router.use('/detalle', detalleRutas);
router.use('/logs', logsRutas);
router.use('/elemento', elementoRutas);
router.use('/tipoOperativo', tipoOperativoRutas);
router.use('/puesto', puestoRutas);
router.get('/', (req, res) => {
    res.send('API is working');
});

export default router;