import { createComunicadoSchema, updateComunicadoSchema } from '../schemas/comunicado.schema.js';
import { ComunicadoModel } from '../models/comunicado.model.js';
import { saveFile } from '../utils/file.js';

export class ComunicadoController {
  static async create(req, res) {
    try {
      const data = createComunicadoSchema.parse(req.body);
      let adjunto = null;

      if (req.files?.adjunto) {
        const file = req.files.adjunto;
        const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        
        if (!validTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: 'El adjunto debe ser un archivo PDF o Excel' });
        }
        adjunto = `${Date.now()}_${file.name}`;
      }

      const comunicado = await ComunicadoModel.create({
        ...data,
        adjunto,
        usuario: 'system' // TODO: Get from auth
      });

      if (adjunto) {
        await saveFile(
          req.files.adjunto,
          `comunicado/${comunicado.idcomunicado}/${adjunto}`
        );
      }

      res.status(201).json(comunicado);
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
      const data = updateComunicadoSchema.parse(req.body);
      let adjunto = null;

      if (req.files?.adjunto) {
        const file = req.files.adjunto;
        const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        
        if (!validTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: 'El adjunto debe ser un archivo PDF o Excel' });
        }
        adjunto = `${Date.now()}_${file.name}`;
      }

      const comunicado = await ComunicadoModel.update(id, {
        ...data,
        adjunto,
        usuario: 'system' // TODO: Get from auth
      });

      if (!comunicado) {
        return res.status(404).json({ 
          message: 'Comunicado no encontrado o no se puede editar porque ya está confirmado' 
        });
      }

      if (adjunto) {
        await saveFile(
          req.files.adjunto,
          `comunicado/${comunicado.idcomunicado}/${adjunto}`
        );
      }

      res.json(comunicado);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      throw error;
    }
  }

  static async findAll(req, res) {
    try {
      const { fechaEmisionInicio, fechaEmisionFin, tipoReceptor, estado } = req.query;
      const comunicados = await ComunicadoModel.findAll({
        fechaEmisionInicio,
        fechaEmisionFin,
        tipoReceptor: tipoReceptor ? parseInt(tipoReceptor) : null,
        estado: estado ? parseInt(estado) : null,
      });
      res.json(comunicados);
    } catch (error) {
      throw error;
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const comunicado = await ComunicadoModel.findById(id);
      
      if (!comunicado) {
        return res.status(404).json({ message: 'Comunicado no encontrado' });
      }

      res.json(comunicado);
    } catch (error) {
      throw error;
    }
  }

  static async confirmar(req, res) {
    try {
      const { id } = req.params;
      const comunicado = await ComunicadoModel.confirmar(id, 'system'); // TODO: Get from auth
      res.json(comunicado);
    } catch (error) {
      if (error.message === 'Comunicado no encontrado o ya confirmado') {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }
  }
}