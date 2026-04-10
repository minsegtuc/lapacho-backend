import express from 'express';
import { createElemento, updateElemento, obtenerElemento} from '../controllers/elemento.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();
router.post('/', verifyToken, createElemento);
router.post('/obtener', verifyToken, obtenerElemento);
router.put('/:idElemento', verifyToken, updateElemento);

export default router;