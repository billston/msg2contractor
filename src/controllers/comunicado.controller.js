import { createComunicadoSchema, updateComunicadoSchema } from '../schemas/comunicado.schema.js';
import { ComunicadoService } from '../services/comunicado.service.js';
import { handleError } from '../utils/errorHandler.js';

export class ComunicadoController {
  static async create(req, res) {
    try {
      const parseData = JSON.parse(req.body.data);
      parseData.fechaVencimiento === "" && delete parseData.fechaVencimiento;
      
      const data = createComunicadoSchema.parse(parseData);
      let adjunto = null;

      if (req.files?.adjunto) {
        const file = req.files.adjunto;
        const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        
        if (!validTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: 'El adjunto debe ser un archivo PDF o Excel' });
        }
        adjunto = file;
      }

      const comunicado = await ComunicadoService.create({
        ...data,
        adjunto,
        usuario: 'system' // TODO: Get from auth
      });

      res.status(201).json(comunicado);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = updateComunicadoSchema.parse(JSON.parse(req.body.data));
      let adjunto = null;

      if (req.files?.adjunto) {
        const file = req.files.adjunto;
        const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        
        if (!validTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: 'El adjunto debe ser un archivo PDF o Excel' });
        }
        adjunto = file;
      }

      const comunicado = await ComunicadoService.update(id, {
        ...data,
        adjunto,
        usuario: 'system' // TODO: Get from auth
      });

      if (!comunicado) {
        return res.status(404).json({ 
          message: 'Comunicado no encontrado o no se puede editar porque ya está confirmado' 
        });
      }

      res.json(comunicado);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async findAll(req, res) {
    try {
      const { fechaEmisionInicio, fechaEmisionFin, tipoReceptor, estado } = req.query;
      const comunicados = await ComunicadoService.findAll({
        fechaEmisionInicio,
        fechaEmisionFin,
        tipoReceptor: tipoReceptor ? parseInt(tipoReceptor) : null,
        estado: estado ? parseInt(estado) : null,
      });
      res.json(comunicados);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const comunicado = await ComunicadoService.findById(id);
      
      if (!comunicado) {
        return res.status(404).json({ message: 'Comunicado no encontrado' });
      }

      res.json(comunicado);
    } catch (error) {
      handleError(res, error);
    }
  }

  static async confirmar(req, res) {
    try {
      const { id } = req.params;
      const comunicado = await ComunicadoService.confirmar(id, 'system'); // TODO: Get from auth
      res.json(comunicado);
    } catch (error) {
      handleError(res, error);
    }
  }
}