import { createGrupoSchema, updateGrupoSchema, addMiembroSchema } from '../schemas/grupo.schema.js';
import { GrupoService } from '../services/grupo.service.js';
import { handleError } from '../utils/errorHandler.js';

export class GrupoController {
  static async create(req, res) {
    try {
      const data = createGrupoSchema.parse(req.body);
      const grupo = await GrupoService.create({
        ...data,
        usuario: 'system' // TODO: Get from auth
      });
      res.status(201).json(grupo);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = updateGrupoSchema.parse(req.body);
      
      const grupo = await GrupoService.update(id, {
        ...data,
        usuario: 'system' // TODO: Get from auth
      });

      if (!grupo) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }

      res.json(grupo);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const hasComunicados = await GrupoService.hasComunicados(id);
      if (hasComunicados) {
        return res.status(409).json({
          message: 'No se puede eliminar el grupo porque tiene comunicados asociados'
        });
      }

      const grupo = await GrupoService.delete(id);
      if (!grupo) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }

      res.json({ message: 'Grupo eliminado exitosamente' });
    } catch (error) {
      handleError(res, error);
    }
  }

  static async findAll(req, res) {
    try {
      const { search } = req.query;
      const grupos = await GrupoService.findAll({
        search
      });
      res.json(grupos);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const grupo = await GrupoService.findById(id);
      
      if (!grupo) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }

      res.json(grupo);
    } catch (error) {
      throw error;
    }
  }

  // Miembros controllers
  static async addMiembro(req, res) {
    try {
      const { id: idGrupoReceptor } = req.params;
      const data = addMiembroSchema.parse(req.body);

      const grupo = await GrupoService.findById(idGrupoReceptor);
      if (!grupo) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }

      const isMiembro = await GrupoService.isMiembro(idGrupoReceptor, data.idReceptor);
      if (isMiembro) {
        return res.status(400).json({ message: 'El receptor ya es miembro del grupo' });
      }

      const miembro = await GrupoService.addMiembro({
        idGrupoReceptor,
        idReceptor: data.idReceptor,
        usuario: 'system' // TODO: Get from auth
      });

      res.status(201).json(miembro);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      throw error;
    }
  }

  static async removeMiembro(req, res) {
    try {
      const { id: idGrupoReceptor, idReceptor } = req.params;

      const miembro = await GrupoService.removeMiembro(idGrupoReceptor, idReceptor);
      if (!miembro) {
        return res.status(404).json({ message: 'Miembro no encontrado en el grupo' });
      }

      res.json({ message: 'Miembro eliminado exitosamente' });
    } catch (error) {
      throw error;
    }
  }

  static async getMiembros(req, res) {
    try {
      const { id } = req.params;
      const miembros = await GrupoService.getMiembros(id);
      console.log("miembros: ", miembros);
      res.json(miembros);
    } catch (error) {
      throw error;
    }
  }
}