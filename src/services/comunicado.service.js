import { Op } from 'sequelize';
import { Comunicado, GrupoReceptor, Notificacion, Receptor } from '../database/models/index.js';
import { saveFile } from '../utils/file.js';
import sequelize from '../database/config.js';

export class ComunicadoService {
  static async create({
    tipoReceptor,
    idGrupoReceptor,
    destinatario,
    asunto,
    contenido,
    adjunto,
    fechaVencimiento,
    confirmacionRecepcion,
    solicitarRespuesta,
    usuario,
  }) {
    const comunicado = await Comunicado.create({
      tipoReceptor,
      idGrupoReceptor,
      destinatario,
      asunto,
      contenido,
      adjunto: adjunto?.name,
      fechaVencimiento,
      confirmacionRecepcion,
      solicitarRespuesta,
      idEstadoComunicado: 1,
      creadoPor: usuario,
    });

    if (adjunto) {
      await saveFile(
        adjunto,
        `comunicado/${comunicado.idComunicado}/${adjunto.name}`
      );
    }

    return comunicado;
  }

  static async update(id, {
    tipoReceptor,
    idGrupoReceptor,
    destinatario,
    asunto,
    contenido,
    adjunto,
    fechaVencimiento,
    confirmacionRecepcion,
    solicitarRespuesta,
    usuario,
  }) {
    const comunicado = await Comunicado.findOne({
      where: {
        idComunicado: id,
        idEstadoComunicado: 1
      }
    });

    if (!comunicado) {
      return null;
    }

    await comunicado.update({
      tipoReceptor,
      idGrupoReceptor,
      destinatario,
      asunto,
      contenido,
      adjunto: adjunto ? adjunto.name : comunicado.adjunto,
      fechaVencimiento,
      confirmacionRecepcion,
      solicitarRespuesta,
      actualizadoPor: usuario,
    });

    if (adjunto) {
      await saveFile(
        adjunto,
        `comunicado/${comunicado.idComunicado}/${adjunto.name}`
      );
    }

    return comunicado;
  }

  static async findById(id) {
    return Comunicado.findByPk(id, {
      include: [
        {
          model: GrupoReceptor,
          attributes: ['nombre']
        }
      ]
    });
  }

  static async findAll({ fechaEmisionInicio, fechaEmisionFin, tipoReceptor, estado }) {
    const where = {};

    if (fechaEmisionInicio) {
      where.fechaEmision = {
        ...where.fechaEmision,
        [Op.gte]: fechaEmisionInicio
      };
    }

    if (fechaEmisionFin) {
      where.fechaEmision = {
        ...where.fechaEmision,
        [Op.lte]: fechaEmisionFin
      };
    }

    if (tipoReceptor) {
      where.tipoReceptor = tipoReceptor;
    }

    if (estado) {
      where.idEstadoComunicado = estado;
    }

    return Comunicado.findAll({
      where,
      include: [
        {
          model: GrupoReceptor,
          attributes: ['nombre']
        }
      ],
      order: [['fechaCreacion', 'DESC']]
    });
  }

  static async confirmar(id, usuario) {
    const transaction = await sequelize.transaction();

    try {
      const comunicado = await Comunicado.findOne({
        where: {
          idComunicado: id,
          idEstadoComunicado: 1
        },
        transaction
      });

      if (!comunicado) {
        await transaction.rollback();
        throw new Error('Comunicado no encontrado o ya confirmado');
      }

      await comunicado.update({
        idEstadoComunicado: 2,
        fechaEmision: new Date(),
        actualizadoPor: usuario
      }, { transaction });

      // Generate notifications
      if (comunicado.tipoReceptor === 1) {
        // Individual recipients
        const receptores = comunicado.destinatario.split(';').filter(Boolean);
        for (const idReceptor of receptores) {
          await Notificacion.create({
            idComunicado: comunicado.idComunicado,
            idReceptor: parseInt(idReceptor),
            fechaEmision: new Date(),
            idEstadoNotificacion: 1,
            creadoPor: usuario
          }, { transaction });
        }
      } else {
        // Group recipients
        const miembros = await Receptor.findAll({
          include: [{
            model: GrupoReceptor,
            where: { idGrupoReceptor: comunicado.idGrupoReceptor },
            through: { attributes: [] }
          }],
          transaction
        });

        for (const miembro of miembros) {
          await Notificacion.create({
            idComunicado: comunicado.idComunicado,
            idReceptor: miembro.idReceptor,
            fechaEmision: new Date(),
            idEstadoNotificacion: 1,
            creadoPor: usuario
          }, { transaction });
        }
      }

      await transaction.commit();
      return comunicado;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}