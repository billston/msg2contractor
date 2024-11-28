import { respuestaSchema } from '../schemas/notificacion.schema.js';
import { NotificacionModel } from '../models/notificacion.model.js';
import { saveFile } from '../utils/file.js';
import { sendEmail } from '../utils/email.js';

export class NotificacionController {
  static async findAll(req, res) {
    try {
      const {
        fechaEmisionInicio,
        fechaEmisionFin,
        fechaRecepcion,
        fechaRespuesta,
        asuntoComunicado,
        nombreReceptor,
      } = req.query;

      if (!fechaEmisionInicio || !fechaEmisionFin) {
        return res.status(400).json({
          message: 'El rango de fecha de emisión es obligatorio',
        });
      }

      const notificaciones = await NotificacionModel.findAll({
        fechaEmisionInicio,
        fechaEmisionFin,
        fechaRecepcion,
        fechaRespuesta,
        asuntoComunicado,
        nombreReceptor,
      });

      res.json(notificaciones);
    } catch (error) {
      throw error;
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const notificacion = await NotificacionModel.findById(id);

      if (!notificacion) {
        return res.status(404).json({ message: 'Notificación no encontrada' });
      }

      res.json(notificacion);
    } catch (error) {
      throw error;
    }
  }

  static async confirmarRecepcion(req, res) {
    try {
      const { id } = req.params;
      const notificacion = await NotificacionModel.confirmarRecepcion(id, 'system'); // TODO: Get from auth

      if (!notificacion) {
        return res.status(404).json({
          message: 'Notificación no encontrada o ya fue confirmada',
        });
      }

      // Send email notification
      await sendEmail({
        subject: 'Confirmación de Recepción',
        text: `La notificación #${id} ha sido confirmada como recibida.`,
        html: `<p>La notificación #${id} ha sido confirmada como recibida.</p>`,
      });

      res.json(notificacion);
    } catch (error) {
      throw error;
    }
  }

  static async responder(req, res) {
    try {
      const { id } = req.params;
      const data = respuestaSchema.parse(req.body);
      let adjunto = null;

      if (req.files?.adjunto) {
        const file = req.files.adjunto;
        const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        
        if (!validTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: 'El adjunto debe ser un archivo PDF o Excel' });
        }
        adjunto = `${Date.now()}_${file.name}`;
      }

      const notificacion = await NotificacionModel.responder(id, {
        ...data,
        adjunto,
        usuario: 'system', // TODO: Get from auth
      });

      if (!notificacion) {
        return res.status(404).json({
          message: 'Notificación no encontrada o no está en estado recibido',
        });
      }

      if (adjunto) {
        await saveFile(
          req.files.adjunto,
          `notificacion/${notificacion.idnotificacion}/${adjunto}`
        );
      }

      // Send email notification
      await sendEmail({
        subject: 'Nueva Respuesta a Notificación',
        text: `Se ha recibido una respuesta para la notificación #${id}.`,
        html: `<p>Se ha recibido una respuesta para la notificación #${id}.</p>`,
      });

      res.json(notificacion);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
      throw error;
    }
  }
}