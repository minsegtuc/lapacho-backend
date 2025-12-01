import express from 'express';
import { createElemento, updateElemento, obtenerElemento} from '../controllers/elemento.controller.js';

const router = express.Router();
router.post('/', createElemento);
router.post('/', obtenerElemento);
router.put('/:idElemento', updateElemento);

export default router;