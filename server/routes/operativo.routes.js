import express from 'express';
import { createOperativo, updateOperativo, obtenerOperativo, buscarPeriodoExistente, obtenerOperativoPorId, conteoPuestos} from '../controllers/operativo.controller.js';

const router = express.Router();
router.post('/', createOperativo);
router.get('/', obtenerOperativo);
router.get('/puestos', conteoPuestos);
router.post('/obtenerOperativo', obtenerOperativoPorId);
router.post('/buscarPeriodo', buscarPeriodoExistente);
router.put('/:idOperativo', updateOperativo);

export default router;