import express from 'express';
import { createDetalle, updateDetalle, obtenerDetalle, obtenerDetalleAcumulado} from '../controllers/detalle.controller.js';

const router = express.Router();
router.post('/', createDetalle);
router.get('/', obtenerDetalle);
router.put('/:idDetalle', updateDetalle);
router.post('/acumulado', obtenerDetalleAcumulado);

export default router;