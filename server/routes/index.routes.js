import express from 'express';
import lapachoRutas from './lapacho.routes.js';
import detalleRutas from './detalle.routes.js';
import logsRutas from './logs.routes.js';
import elementoRutas from './elemento.routes.js';


const router = express.Router();
router.use('/lapacho', lapachoRutas);
router.use('/detalle', detalleRutas);
router.use('/logs', logsRutas);
router.use('/elemento', elementoRutas);
router.get('/', (req, res) => {
    res.send('API is working');
});

export default router;