import { Op } from 'sequelize';
import { Receptor } from '../database/models/index.js';
import { saveFile } from '../utils/file.js';

export class ReceptorService {
  static async create({ codigo, nombreCompleto, correoElectronico, firma, usuario }) {
    const receptor = await Receptor.create({
      codigo,
      nombreCompleto,
      correoElectronico,
      firma,
      creadoPor: usuario
    });

    if (firma) {
      await saveFile(
        firma,
        `receptor/firma/${receptor.idReceptor}/${firma.name}`
      );
    }

    return receptor;
  }

  static async update(id, { codigo, nombreCompleto, correoElectronico, firma, usuario }) {
    const receptor = await Receptor.findByPk(id);
    
    if (!receptor) {
      return null;
    }

    await receptor.update({
      codigo,
      nombreCompleto,
      correoElectronico,
      firma: firma ? firma.name : receptor.firma,
      actualizadoPor: usuario
    });

    if (firma) {
      await saveFile(
        firma,
        `receptor/firma/${receptor.idReceptor}/${firma.name}`
      );
    }

    return receptor;
  }

  static async delete(id) {
    const receptor = await Receptor.findByPk(id);
    
    if (!receptor) {
      return null;
    }

    await receptor.destroy();
    return receptor;
  }

  static async findById(id) {
    return Receptor.findByPk(id);
  }

  static async findAll({ codigo, nombreCompleto }) {
    const where = {};

    if (codigo) {
      where.codigo = { [Op.iLike]: `%${codigo}%` };
    }

    if (nombreCompleto) {
      where.nombreCompleto = { [Op.iLike]: `%${nombreCompleto}%` };
    }

    return Receptor.findAll({
      where,
      order: [['nombreCompleto', 'ASC']]
    });
  }

  static async hasNotifications(id) {
    const receptor = await Receptor.findByPk(id, {
      include: ['Notificaciones']
    });
    return receptor?.Notificaciones?.length > 0;
  }
}