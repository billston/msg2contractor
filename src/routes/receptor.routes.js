import { Router } from 'express';
import { ReceptorController } from '../controllers/receptor.controller.js';

const router = Router();

/**
 * @swagger
 * /receptores:
 *   post:
 *     summary: Crear un nuevo receptor
 *     tags: [Receptores]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombreCompleto:
 *                 type: string
 *               correoElectronico:
 *                 type: string
 *                 format: email
 *               firma:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Receptor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receptor'
 */
router.post('/', ReceptorController.create);

/**
 * @swagger
 * /receptores/{id}:
 *   put:
 *     summary: Actualizar un receptor existente
 *     tags: [Receptores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombreCompleto:
 *                 type: string
 *               correoElectronico:
 *                 type: string
 *                 format: email
 *               firma:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receptor actualizado exitosamente
 */
router.put('/:id', ReceptorController.update);

/**
 * @swagger
 * /receptores/{id}:
 *   delete:
 *     summary: Eliminar un receptor
 *     tags: [Receptores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Receptor eliminado exitosamente
 */
router.delete('/:id', ReceptorController.delete);

/**
 * @swagger
 * /receptores:
 *   get:
 *     summary: Obtener lista de receptores
 *     tags: [Receptores]
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *       - in: query
 *         name: nombreCompleto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de receptores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receptor'
 */
router.get('/', ReceptorController.findAll);

/**
 * @swagger
 * /receptores/{id}:
 *   get:
 *     summary: Obtener un receptor por ID
 *     tags: [Receptores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del receptor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receptor'
 */
router.get('/:id', ReceptorController.findById);

export { router as receptorRoutes };