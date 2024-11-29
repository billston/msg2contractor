import { Router } from 'express';
import { GrupoController } from '../controllers/grupo.controller.js';

const router = Router();

// Grupo routes
router.post('/', GrupoController.create);
router.put('/:id', GrupoController.update);
router.delete('/:id', GrupoController.delete);
router.get('/', GrupoController.findAll);
router.get('/:id', GrupoController.findById);

// Miembros routes
router.post('/:id/miembros', GrupoController.addMiembro);
router.delete('/:id/miembros/:idReceptor', GrupoController.removeMiembro);
router.get('/:id/miembros', GrupoController.getMiembros);

export { router as grupoRoutes };