import express from 'express';
import { createLapacho, updateLapacho, obtenerLapacho, buscarPeriodoExistente, obtenerLapachoPorId} from '../controllers/lapacho.controller.js';

const router = express.Router();
router.post('/', createLapacho);
router.get('/', obtenerLapacho);
router.post('/obtenerLapacho', obtenerLapachoPorId);
router.post('/buscarPeriodo', buscarPeriodoExistente);
router.put('/:idLapacho', updateLapacho);

export default router;