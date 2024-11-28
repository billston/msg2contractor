import { createReceptorSchema, updateReceptorSchema } from '../schemas/receptor.schema.js';
import { ReceptorService } from '../services/receptor.service.js';

export class ReceptorController {
  static async create(req, res) {
    try {
      const data = createReceptorSchema.parse(req.body);
      let firma = null;

      if (req.files?.firma) {
        const file = req.files.firma;
        if (!file.mimetype.startsWith('image/jpeg')) {
          return res.status(400).json({ message: 'La firma debe ser una imagen JPG' });
        }
        firma = file;
      }

      const receptor = await ReceptorService.create({
        ...data,
        firma,
        usuario: 'system', // TODO: Get from auth
      });

      res.status(201).json(receptor);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      throw error;
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = updateReceptorSchema.parse(req.body);
      let firma = null;

      if (req.files?.firma) {
        const file = req.files.firma;
        if (!file.mimetype.startsWith('image/jpeg')) {
          return res.status(400).json({ message: 'La firma debe ser una imagen JPG' });
        }
        firma = file;
      }

      const receptor = await ReceptorService.update(id, {
        ...data,
        firma,
        usuario: 'system', // TODO: Get from auth
      });

      if (!receptor) {
        return res.status(404).json({ message: 'Receptor no encontrado' });
      }

      res.json(receptor);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      throw error;
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const hasNotifications = await ReceptorService.hasNotifications(id);
      if (hasNotifications) {
        return res.status(409).json({
          message: 'No se puede eliminar el receptor porque tiene notificaciones asociadas'
        });
      }

      const receptor = await ReceptorService.delete(id);
      if (!receptor) {
        return res.status(404).json({ message: 'Receptor no encontrado' });
      }

      res.json({ message: 'Receptor eliminado exitosamente' });
    } catch (error) {
      throw error;
    }
  }

  static async findAll(req, res) {
    try {
      const { codigo, nombreCompleto } = req.query;
      const receptores = await ReceptorService.findAll({
        codigo,
        nombreCompleto,
      });
      res.json(receptores);
    } catch (error) {
      throw error;
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const receptor = await ReceptorService.findById(id);

      if (!receptor) {
        return res.status(404).json({ message: 'Receptor no encontrado' });
      }

      res.json(receptor);
    } catch (error) {
      throw error;
    }
  }
}