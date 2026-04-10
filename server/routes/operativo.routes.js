import express from 'express';
import { createOperativo, updateOperativo, obtenerOperativo, buscarPeriodoExistente, obtenerOperativoPorId, conteoPuestos} from '../controllers/operativo.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();
router.post('/', verifyToken, createOperativo);
router.get('/', verifyToken, obtenerOperativo);
router.get('/puestos', verifyToken, conteoPuestos);
router.post('/obtenerOperativo', verifyToken, obtenerOperativoPorId);
router.post('/buscarPeriodo', verifyToken, buscarPeriodoExistente);
router.put('/:idOperativo', verifyToken, updateOperativo);

export default router;