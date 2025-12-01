import express from 'express';
import { createOperativo, updateOperativo, obtenerOperativo, buscarPeriodoExistente, obtenerOperativoPorId} from '../controllers/operativo.controller.js';

const router = express.Router();
router.post('/', createOperativo);
router.get('/', obtenerOperativo);
router.post('/obtenerOperativo', obtenerOperativoPorId);
router.post('/buscarPeriodo', buscarPeriodoExistente);
router.put('/:idOperativo', updateOperativo);

export default router;