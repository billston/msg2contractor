import { Router } from 'express';
import { ComunicadoController } from '../controllers/comunicado.controller.js';

const router = Router();

router.post('/', ComunicadoController.create);
router.put('/:id', ComunicadoController.update);
router.get('/', ComunicadoController.findAll);
router.get('/:id', ComunicadoController.findById);
router.post('/:id/confirmar', ComunicadoController.confirmar);

export { router as comunicadoRoutes };