import { Router } from 'express';
import { NotificacionController } from '../controllers/notificacion.controller.js';

const router = Router();

router.get('/', NotificacionController.findAll);
router.get('/:id', NotificacionController.findById);
router.post('/:id/confirmar', NotificacionController.confirmarRecepcion);
router.post('/:id/responder', NotificacionController.responder);

export { router as notificacionRoutes };