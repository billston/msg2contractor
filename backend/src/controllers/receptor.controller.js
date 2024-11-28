import {
  createReceptorSchema,
  updateReceptorSchema,
} from '../schemas/receptor.schema.js';
import { ReceptorModel } from '../models/receptor.model.js';
import { saveFile } from '../utils/file.js';

export class ReceptorController {
  static async create(req, res) {
    try {
      const data = createReceptorSchema.parse(req.body);
      let firma = null;

      if (req.files?.firma) {
        const file = req.files.firma;
        if (!file.mimetype.startsWith('image/jpeg')) {
          return res
            .status(400)
            .json({ message: 'La firma debe ser una imagen JPG' });
        }
        firma = `${Date.now()}_${file.name}`;
      }

      const receptor = await ReceptorModel.create({
        ...data,
        firma,
        usuario: 'system', // TODO: Get from auth
      });

      if (firma) {
        await saveFile(
          req.files.firma,
          `receptor/firma/${receptor.idreceptor}/${firma}`
        );
      }

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
          return res
            .status(400)
            .json({ message: 'La firma debe ser una imagen JPG' });
        }
        firma = `${Date.now()}_${file.name}`;
      }

      const receptor = await ReceptorModel.update(id, {
        ...data,
        firma,
        usuario: 'system', // TODO: Get from auth
      });

      if (!receptor) {
        return res.status(404).json({ message: 'Receptor no encontrado' });
      }

      if (firma) {
        await saveFile(
          req.files.firma,
          `receptor/firma/${receptor.idreceptor}/${firma}`
        );
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

      const hasNotifications = await ReceptorModel.hasNotifications(id);
      if (hasNotifications) {
        return res.status(409).json({
          message:
            'No se puede eliminar el receptor porque tiene notificaciones asociadas',
        });
      }

      const receptor = await ReceptorModel.delete(id);
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
      console.log(req.query);
      const receptores = await ReceptorModel.findAll({
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
      const receptor = await ReceptorModel.findById(id);

      if (!receptor) {
        return res.status(404).json({ message: 'Receptor no encontrado' });
      }

      res.json(receptor);
    } catch (error) {
      throw error;
    }
  }
}
