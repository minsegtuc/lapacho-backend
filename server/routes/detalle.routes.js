import express from 'express';
import { createDetalle, updateDetalle, obtenerDetalle, obtenerDetalleAcumulado} from '../controllers/detalle.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();
router.post('/', verifyToken, createDetalle);
router.get('/', verifyToken, obtenerDetalle);
router.put('/:idDetalle', verifyToken, updateDetalle);
router.post('/acumulado', verifyToken, obtenerDetalleAcumulado);

export default router;