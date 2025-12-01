import express from 'express'
import { createTipoOperativo } from '../controllers/tipoOperativo.controller'

const router = express.Router();
router.post('/', createTipoOperativo)

export default router;