import { Op } from 'sequelize';
import { Notificacion, Comunicado, Receptor } from '../database/models/index.js';
import { saveFile } from '../utils/file.js';

export class NotificacionService {
  static async findById(id) {
    return Notificacion.findByPk(id, {
      include: [
        {
          model: Comunicado,
          attributes: ['asunto', 'contenido', 'solicitarRespuesta']
        },
        {
          model: Receptor,
          attributes: ['nombreCompleto']
        }
      ]
    });
  }

  static async findAll({
    fechaEmisionInicio,
    fechaEmisionFin,
    fechaRecepcion,
    fechaRespuesta,
    asuntoComunicado,
    nombreReceptor,
  }) {
    const include = [
      {
        model: Comunicado,
        attributes: ['asunto', 'solicitarRespuesta'],
        where: asuntoComunicado ? {
          asunto: { [Op.iLike]: `%${asuntoComunicado}%` }
        } : undefined
      },
      {
        model: Receptor,
        attributes: ['nombreCompleto'],
        where: nombreReceptor ? {
          nombreCompleto: { [Op.iLike]: `%${nombreReceptor}%` }
        } : undefined
      }
    ];

    const where = {
      fechaEmision: {
        [Op.between]: [fechaEmisionInicio, fechaEmisionFin]
      }
    };

    if (fechaRecepcion) {
      where.fechaRecepcion = {
        [Op.gte]: fechaRecepcion,
        [Op.lt]: new Date(new Date(fechaRecepcion).getTime() + 24 * 60 * 60 * 1000)
      };
    }

    if (fechaRespuesta) {
      where.fechaRespuesta = {
        [Op.gte]: fechaRespuesta,
        [Op.lt]: new Date(new Date(fechaRespuesta).getTime() + 24 * 60 * 60 * 1000)
      };
    }

    return Notificacion.findAll({
      where,
      include,
      order: [['fechaEmision', 'DESC']]
    });
  }

  static async confirmarRecepcion(id, usuario) {
    const notificacion = await Notificacion.findOne({
      where: {
        idNotificacion: id,
        idEstadoNotificacion: 1
      }
    });

    if (!notificacion) {
      return null;
    }

    await notificacion.update({
      fechaRecepcion: new Date(),
      idEstadoNotificacion: 2,
      actualizadoPor: usuario
    });

    return notificacion;
  }

  static async responder(id, { respuesta, adjunto, usuario }) {
    const notificacion = await Notificacion.findOne({
      where: {
        idNotificacion: id,
        idEstadoNotificacion: 2
      }
    });

    if (!notificacion) {
      return null;
    }

    await notificacion.update({
      fechaRespuesta: new Date(),
      respuesta,
      adjunto: adjunto ? adjunto.name : notificacion.adjunto,
      idEstadoNotificacion: 3,
      actualizadoPor: usuario
    });

    if (adjunto) {
      await saveFile(
        adjunto,
        `notificacion/${notificacion.idNotificacion}/${adjunto.name}`
      );
    }

    return notificacion;
  }
}